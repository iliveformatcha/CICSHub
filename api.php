<?php
// api.php - Student Council Hub REST API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';

class StudentCouncilAPI {
    private $db;
    private $user;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->authenticate();
    }

    private function authenticate() {
        $headers = apache_request_headers();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if (!$token) {
            // For demo purposes, allow session-based authentication
            session_start();
            if (isset($_SESSION['user'])) {
                $this->user = $_SESSION['user'];
            }
            return;
        }

        // Verify JWT token
        try {
            $payload = $this->verifyJWT($token);
            $this->user = $payload;
        } catch (Exception $e) {
            $this->sendResponse(['error' => 'Invalid token'], 401);
        }
    }

    private function verifyJWT($token) {
        // Simple JWT verification for demo
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }

        $payload = json_decode(base64_decode($parts[1]), true);
        return $payload;
    }

    private function requireAuth() {
        if (!$this->user) {
            $this->sendResponse(['error' => 'Authentication required'], 401);
        }
    }

    private function requireAdmin() {
        $this->requireAuth();
        if ($this->user['role'] !== 'admin') {
            $this->sendResponse(['error' => 'Admin access required'], 403);
        }
    }

    private function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }

    private function getInput() {
        return json_decode(file_get_contents('php://input'), true);
    }

    private function validateRequired($data, $required) {
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                return "Field '$field' is required";
            }
        }
        return null;
    }

    // User Management Endpoints
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        $input = $this->getInput();
        $error = $this->validateRequired($input, ['username', 'password', 'role']);
        if ($error) {
            $this->sendResponse(['error' => $error], 400);
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ? AND role = ? AND is_active = 1");
        $stmt->execute([$input['username'], $input['role']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($input['password'], $user['password'])) {
            // Update last login
            $updateStmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$user['id']]);

            // Create session
            session_start();
            $_SESSION['user'] = [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'student_id' => $user['student_id']
            ];

            $this->sendResponse([
                'message' => 'Login successful',
                'user' => $_SESSION['user']
            ]);
        } else {
            $this->sendResponse(['error' => 'Invalid credentials'], 401);
        }
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        $input = $this->getInput();
        $required = ['username', 'password', 'email', 'student_id'];
        $error = $this->validateRequired($input, $required);
        if ($error) {
            $this->sendResponse(['error' => $error], 400);
        }

        // Check if username or email already exists
        $checkStmt = $this->db->prepare("SELECT id FROM users WHERE username = ? OR email = ? OR student_id = ?");
        $checkStmt->execute([$input['username'], $input['email'], $input['student_id']]);
        if ($checkStmt->fetch()) {
            $this->sendResponse(['error' => 'Username, email, or student ID already exists'], 409);
        }

        // Create user
        $stmt = $this->db->prepare("
            INSERT INTO users (username, password, email, student_id, role, first_name, last_name, department, year_level) 
            VALUES (?, ?, ?, ?, 'student', ?, ?, ?, ?)
        ");

        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
        $success = $stmt->execute([
            $input['username'],
            $hashedPassword,
            $input['email'],
            $input['student_id'],
            $input['first_name'] ?? '',
            $input['last_name'] ?? '',
            $input['department'] ?? '',
            $input['year_level'] ?? ''
        ]);

        if ($success) {
            $this->sendResponse(['message' => 'Registration successful'], 201);
        } else {
            $this->sendResponse(['error' => 'Registration failed'], 500);
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        $this->sendResponse(['message' => 'Logout successful']);
    }

    public function getProfile() {
        $this->requireAuth();
        $this->sendResponse(['user' => $this->user]);
    }

    // Posts Endpoints
    public function getPosts() {
        $section = $_GET['section'] ?? 'announcements';
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;

        $allowedSections = ['announcements', 'rules', 'letters', 'resolutions', 'documents'];
        if (!in_array($section, $allowedSections)) {
            $this->sendResponse(['error' => 'Invalid section'], 400);
        }

        $stmt = $this->db->prepare("
            SELECT p.*, u.username as author_name, u.first_name, u.last_name,
                   (SELECT COUNT(*) FROM post_files pf WHERE pf.post_id = p.id) as file_count
            FROM posts p 
            JOIN users u ON p.author_id = u.id 
            WHERE p.section = ? AND p.is_published = 1 
            ORDER BY p.is_pinned DESC, p.created_at DESC 
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$section, $limit, $offset]);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count for pagination
        $countStmt = $this->db->prepare("SELECT COUNT(*) as total FROM posts WHERE section = ? AND is_published = 1");
        $countStmt->execute([$section]);
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $this->sendResponse([
            'posts' => $posts,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    public function getPost($id) {
        $stmt = $this->db->prepare("
            SELECT p.*, u.username as author_name, u.first_name, u.last_name
            FROM posts p 
            JOIN users u ON p.author_id = u.id 
            WHERE p.id = ? AND p.is_published = 1
        ");
        $stmt->execute([$id]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$post) {
            $this->sendResponse(['error' => 'Post not found'], 404);
        }

        // Increment view count
        $updateStmt = $this->db->prepare("UPDATE posts SET view_count = view_count + 1 WHERE id = ?");
        $updateStmt->execute([$id]);

        // Get files
        $filesStmt = $this->db->prepare("
            SELECT f.* FROM files f 
            JOIN post_files pf ON f.id = pf.file_id 
            WHERE pf.post_id = ?
        ");
        $filesStmt->execute([$id]);
        $post['files'] = $filesStmt->fetchAll(PDO::FETCH_ASSOC);

        $this->sendResponse(['post' => $post]);
    }

    public function createPost() {
        $this->requireAdmin();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        $input = $this->getInput();
        $error = $this->validateRequired($input, ['title', 'content', 'section']);
        if ($error) {
            $this->sendResponse(['error' => $error], 400);
        }

        $stmt = $this->db->prepare("
            INSERT INTO posts (title, content, section, author_id, category, is_pinned) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $success = $stmt->execute([
            $input['title'],
            $input['content'],
            $input['section'],
            $this->user['id'],
            $input['category'] ?? 'general',
            $input['is_pinned'] ?? 0
        ]);

        if ($success) {
            $postId = $this->db->lastInsertId();
            $this->sendResponse(['message' => 'Post created', 'id' => $postId], 201);
        } else {
            $this->sendResponse(['error' => 'Failed to create post'], 500);
        }
    }

    public function updatePost($id) {
        $this->requireAdmin();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        // Check if post exists and belongs to user
        $checkStmt = $this->db->prepare("SELECT author_id FROM posts WHERE id = ?");
        $checkStmt->execute([$id]);
        $post = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$post) {
            $this->sendResponse(['error' => 'Post not found'], 404);
        }

        $input = $this->getInput();
        $stmt = $this->db->prepare("
            UPDATE posts 
            SET title = ?, content = ?, section = ?, category = ?, is_pinned = ?, updated_at = NOW() 
            WHERE id = ?
        ");

        $success = $stmt->execute([
            $input['title'] ?? '',
            $input['content'] ?? '',
            $input['section'] ?? 'announcements',
            $input['category'] ?? 'general',
            $input['is_pinned'] ?? 0,
            $id
        ]);

        if ($success) {
            $this->sendResponse(['message' => 'Post updated']);
        } else {
            $this->sendResponse(['error' => 'Failed to update post'], 500);
        }
    }

    public function deletePost($id) {
        $this->requireAdmin();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        $stmt = $this->db->prepare("DELETE FROM posts WHERE id = ?");
        $success = $stmt->execute([$id]);

        if ($success) {
            $this->sendResponse(['message' => 'Post deleted']);
        } else {
            $this->sendResponse(['error' => 'Failed to delete post'], 500);
        }
    }

    // Events Endpoints
    public function getEvents() {
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;
        $category = $_GET['category'] ?? 'all';
        $upcoming = isset($_GET['upcoming']) ? filter_var($_GET['upcoming'], FILTER_VALIDATE_BOOLEAN) : false;

        $query = "
            SELECT e.*, u.username as organizer_name, u.first_name, u.last_name,
                   (SELECT COUNT(*) FROM event_attendees ea WHERE ea.event_id = e.id) as attendee_count
            FROM events e 
            JOIN users u ON e.organizer_id = u.id 
            WHERE e.is_published = 1
        ";

        $params = [];

        if ($category !== 'all') {
            $query .= " AND e.category = ?";
            $params[] = $category;
        }

        if ($upcoming) {
            $query .= " AND e.event_date >= CURDATE()";
        }

        $query .= " ORDER BY e.event_date ASC, e.event_time ASC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM events e WHERE e.is_published = 1";
        $countParams = [];
        
        if ($category !== 'all') {
            $countQuery .= " AND e.category = ?";
            $countParams[] = $category;
        }

        if ($upcoming) {
            $countQuery .= " AND e.event_date >= CURDATE()";
        }

        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($countParams);
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $this->sendResponse([
            'events' => $events,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    public function getEvent($id) {
        $stmt = $this->db->prepare("
            SELECT e.*, u.username as organizer_name, u.first_name, u.last_name
            FROM events e 
            JOIN users u ON e.organizer_id = u.id 
            WHERE e.id = ? AND e.is_published = 1
        ");
        $stmt->execute([$id]);
        $event = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$event) {
            $this->sendResponse(['error' => 'Event not found'], 404);
        }

        // Get files
        $filesStmt = $this->db->prepare("
            SELECT f.* FROM files f 
            JOIN event_files ef ON f.id = ef.file_id 
            WHERE ef.event_id = ?
        ");
        $filesStmt->execute([$id]);
        $event['files'] = $filesStmt->fetchAll(PDO::FETCH_ASSOC);

        // Get attendee count
        $attendeeStmt = $this->db->prepare("SELECT COUNT(*) as attendee_count FROM event_attendees WHERE event_id = ?");
        $attendeeStmt->execute([$id]);
        $event['attendee_count'] = $attendeeStmt->fetch(PDO::FETCH_ASSOC)['attendee_count'];

        // Check if current user is registered
        if ($this->user) {
            $userAttendeeStmt = $this->db->prepare("SELECT * FROM event_attendees WHERE event_id = ? AND user_id = ?");
            $userAttendeeStmt->execute([$id, $this->user['id']]);
            $event['user_registered'] = $userAttendeeStmt->fetch(PDO::FETCH_ASSOC) !== false;
        }

        $this->sendResponse(['event' => $event]);
    }

    public function createEvent() {
        $this->requireAdmin();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        $input = $this->getInput();
        $error = $this->validateRequired($input, ['title', 'event_date', 'event_time', 'venue']);
        if ($error) {
            $this->sendResponse(['error' => $error], 400);
        }

        $stmt = $this->db->prepare("
            INSERT INTO events (title, description, event_date, event_time, venue, category, organizer_id, max_attendees) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $success = $stmt->execute([
            $input['title'],
            $input['description'] ?? '',
            $input['event_date'],
            $input['event_time'],
            $input['venue'],
            $input['category'] ?? 'general',
            $this->user['id'],
            $input['max_attendees'] ?? null
        ]);

        if ($success) {
            $eventId = $this->db->lastInsertId();
            $this->sendResponse(['message' => 'Event created', 'id' => $eventId], 201);
        } else {
            $this->sendResponse(['error' => 'Failed to create event'], 500);
        }
    }

    public function registerForEvent($eventId) {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        // Check if event exists and has space
        $eventStmt = $this->db->prepare("SELECT max_attendees FROM events WHERE id = ? AND is_published = 1");
        $eventStmt->execute([$eventId]);
        $event = $eventStmt->fetch(PDO::FETCH_ASSOC);

        if (!$event) {
            $this->sendResponse(['error' => 'Event not found'], 404);
        }

        if ($event['max_attendees']) {
            $attendeeCountStmt = $this->db->prepare("SELECT COUNT(*) as count FROM event_attendees WHERE event_id = ?");
            $attendeeCountStmt->execute([$eventId]);
            $count = $attendeeCountStmt->fetch(PDO::FETCH_ASSOC)['count'];

            if ($count >= $event['max_attendees']) {
                $this->sendResponse(['error' => 'Event is full'], 409);
            }
        }

        // Check if already registered
        $checkStmt = $this->db->prepare("SELECT id FROM event_attendees WHERE event_id = ? AND user_id = ?");
        $checkStmt->execute([$eventId, $this->user['id']]);
        if ($checkStmt->fetch()) {
            $this->sendResponse(['error' => 'Already registered for this event'], 409);
        }

        // Register
        $stmt = $this->db->prepare("INSERT INTO event_attendees (event_id, user_id) VALUES (?, ?)");
        $success = $stmt->execute([$eventId, $this->user['id']]);

        if ($success) {
            $this->sendResponse(['message' => 'Successfully registered for event'], 201);
        } else {
            $this->sendResponse(['error' => 'Registration failed'], 500);
        }
    }

    // Files Endpoints
    public function getFiles() {
        $section = $_GET['section'] ?? 'all';
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;

        $query = "
            SELECT f.*, u.username as uploader_name 
            FROM files f 
            JOIN users u ON f.uploaded_by = u.id 
            WHERE 1=1
        ";

        $params = [];

        if ($section !== 'all') {
            $query .= " AND f.section = ?";
            $params[] = $section;
        }

        $query .= " ORDER BY f.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $files = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM files f WHERE 1=1";
        $countParams = [];
        
        if ($section !== 'all') {
            $countQuery .= " AND f.section = ?";
            $countParams[] = $section;
        }

        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($countParams);
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $this->sendResponse([
            'files' => $files,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    public function downloadFile($id) {
        $stmt = $this->db->prepare("SELECT * FROM files WHERE id = ?");
        $stmt->execute([$id]);
        $file = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$file) {
            $this->sendResponse(['error' => 'File not found'], 404);
        }

        // Increment download count
        $updateStmt = $this->db->prepare("UPDATE files SET download_count = download_count + 1 WHERE id = ?");
        $updateStmt->execute([$id]);

        // Return file info - actual file serving would be handled by a separate endpoint
        $this->sendResponse(['file' => $file]);
    }

    // Feedback Endpoints
    public function getFeedback() {
        $this->requireAuth();

        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;
        $status = $_GET['status'] ?? 'all';

        if ($this->user['role'] === 'admin') {
            $query = "
                SELECT f.*, u.username, u.first_name, u.last_name, u.email,
                       a.username as responder_name
                FROM feedback f 
                JOIN users u ON f.user_id = u.id 
                LEFT JOIN users a ON f.responded_by = a.id 
                WHERE 1=1
            ";
            $params = [];

            if ($status !== 'all') {
                $query .= " AND f.status = ?";
                $params[] = $status;
            }

            $query .= " ORDER BY f.created_at DESC LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get total count
            $countQuery = "SELECT COUNT(*) as total FROM feedback f WHERE 1=1";
            $countParams = [];
            
            if ($status !== 'all') {
                $countQuery .= " AND f.status = ?";
                $countParams[] = $status;
            }

            $countStmt = $this->db->prepare($countQuery);
            $countStmt->execute($countParams);
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        } else {
            // Students can only see their own feedback
            $stmt = $this->db->prepare("
                SELECT f.*, u.username as responder_name
                FROM feedback f 
                LEFT JOIN users u ON f.responded_by = u.id 
                WHERE f.user_id = ? 
                ORDER BY f.created_at DESC 
                LIMIT ? OFFSET ?
            ");
            $stmt->execute([$this->user['id'], $limit, $offset]);
            $feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $countStmt = $this->db->prepare("SELECT COUNT(*) as total FROM feedback WHERE user_id = ?");
            $countStmt->execute([$this->user['id']]);
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        }

        $this->sendResponse([
            'feedback' => $feedback,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    public function submitFeedback() {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        $input = $this->getInput();
        $error = $this->validateRequired($input, ['subject', 'message']);
        if ($error) {
            $this->sendResponse(['error' => $error], 400);
        }

        $stmt = $this->db->prepare("
            INSERT INTO feedback (user_id, subject, message, category, priority) 
            VALUES (?, ?, ?, ?, ?)
        ");

        $success = $stmt->execute([
            $this->user['id'],
            $input['subject'],
            $input['message'],
            $input['category'] ?? 'suggestion',
            $input['priority'] ?? 'medium'
        ]);

        if ($success) {
            $this->sendResponse(['message' => 'Feedback submitted successfully'], 201);
        } else {
            $this->sendResponse(['error' => 'Failed to submit feedback'], 500);
        }
    }

    public function respondToFeedback($id) {
        $this->requireAdmin();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->sendResponse(['error' => 'Method not allowed'], 405);
        }

        $input = $this->getInput();
        $error = $this->validateRequired($input, ['admin_response', 'status']);
        if ($error) {
            $this->sendResponse(['error' => $error], 400);
        }

        $stmt = $this->db->prepare("
            UPDATE feedback 
            SET admin_response = ?, status = ?, responded_by = ?, responded_at = NOW() 
            WHERE id = ?
        ");

        $success = $stmt->execute([
            $input['admin_response'],
            $input['status'],
            $this->user['id'],
            $id
        ]);

        if ($success) {
            $this->sendResponse(['message' => 'Response submitted']);
        } else {
            $this->sendResponse(['error' => 'Failed to submit response'], 500);
        }
    }

    // Statistics Endpoints
    public function getStats() {
        $this->requireAdmin();

        // Basic statistics
        $usersStmt = $this->db->prepare("SELECT COUNT(*) as total FROM users WHERE is_active = 1");
        $usersStmt->execute();
        $totalUsers = $usersStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $postsStmt = $this->db->prepare("SELECT COUNT(*) as total FROM posts WHERE is_published = 1");
        $postsStmt->execute();
        $totalPosts = $postsStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $eventsStmt = $this->db->prepare("SELECT COUNT(*) as total FROM events WHERE is_published = 1");
        $eventsStmt->execute();
        $totalEvents = $eventsStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $feedbackStmt = $this->db->prepare("SELECT COUNT(*) as total FROM feedback");
        $feedbackStmt->execute();
        $totalFeedback = $feedbackStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $pendingFeedbackStmt = $this->db->prepare("SELECT COUNT(*) as total FROM feedback WHERE status = 'pending'");
        $pendingFeedbackStmt->execute();
        $pendingFeedback = $pendingFeedbackStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $this->sendResponse([
            'stats' => [
                'total_users' => $totalUsers,
                'total_posts' => $totalPosts,
                'total_events' => $totalEvents,
                'total_feedback' => $totalFeedback,
                'pending_feedback' => $pendingFeedback
            ]
        ]);
    }

    // Handle API requests
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_GET['path'] ?? '';

        $routes = explode('/', $path);
        $endpoint = $routes[0] ?? '';
        $param1 = $routes[1] ?? null;
        $param2 = $routes[2] ?? null;

        try {
            switch ($endpoint) {
                case 'auth':
                    if ($param1 === 'login') {
                        $this->login();
                    } elseif ($param1 === 'register') {
                        $this->register();
                    } elseif ($param1 === 'logout') {
                        $this->logout();
                    } elseif ($param1 === 'profile') {
                        $this->getProfile();
                    }
                    break;

                case 'posts':
                    if ($method === 'GET' && $param1 === null) {
                        $this->getPosts();
                    } elseif ($method === 'GET' && $param1) {
                        $this->getPost($param1);
                    } elseif ($method === 'POST') {
                        $this->createPost();
                    } elseif ($method === 'PUT' && $param1) {
                        $this->updatePost($param1);
                    } elseif ($method === 'DELETE' && $param1) {
                        $this->deletePost($param1);
                    }
                    break;

                case 'events':
                    if ($method === 'GET' && $param1 === null) {
                        $this->getEvents();
                    } elseif ($method === 'GET' && $param1) {
                        $this->getEvent($param1);
                    } elseif ($method === 'POST') {
                        $this->createEvent();
                    } elseif ($method === 'POST' && $param1 && $param2 === 'register') {
                        $this->registerForEvent($param1);
                    }
                    break;

                case 'files':
                    if ($method === 'GET' && $param1 === null) {
                        $this->getFiles();
                    } elseif ($method === 'GET' && $param1 && $param2 === 'download') {
                        $this->downloadFile($param1);
                    }
                    break;

                case 'feedback':
                    if ($method === 'GET') {
                        $this->getFeedback();
                    } elseif ($method === 'POST') {
                        $this->submitFeedback();
                    } elseif ($method === 'PUT' && $param1) {
                        $this->respondToFeedback($param1);
                    }
                    break;

                case 'stats':
                    if ($method === 'GET') {
                        $this->getStats();
                    }
                    break;

                default:
                    $this->sendResponse(['error' => 'Endpoint not found'], 404);
            }
        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }
}

// Initialize and handle the request
$api = new StudentCouncilAPI();
$api->handleRequest();
?>