import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Alert, Badge, Modal, Nav, Dropdown } from "react-bootstrap";
import { FaTrash, FaEdit, FaEye, FaPlus, FaList } from "react-icons/fa";
import {getAllBadges,getBadgeById,createOrUpdateBadge,deleteBadge} from "../service/BadgeService";
import {getAllCourses} from "../service/CourseService";

const CourseBadgeManagement = () => {
    // State variables
    const [courses, setCourses] = useState([]); // List of courses
    const [badges, setBadges] = useState([]); // List of badges
    const [selectedCourse, setSelectedCourse] = useState(null); // Selected course from dropdown
    const [badgeName, setBadgeName] = useState(""); // Badge name input
    const [badgeDescription, setBadgeDescription] = useState(""); // Badge description input
    const [selectedBadge, setSelectedBadge] = useState(null); // Selected badge for editing/viewing
    const [isEditing, setIsEditing] = useState(false); // Editing mode
    const [notification, setNotification] = useState(""); // Notification message
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [activeTab, setActiveTab] = useState("badges"); // Active tab (badges or add-badge)

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const fetchedBadges = await getAllBadges();
                setBadges(fetchedBadges);
            } catch (error) {
                console.error("Error fetching badges:", error);
            }
        };

        const fetchCourses = async () => {
            try {
                const coursesData = await getAllCourses();
                setCourses(coursesData); // Set courses in state
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchBadges();
        fetchCourses();
    }, []);

    const handleAddOrUpdateBadge = async (e) => {
        e.preventDefault();
        if (!badgeName || !badgeDescription || !selectedCourse) {
            alert("Please fill in all fields and select a course.");
            return;
        }

        const newBadge = {
            badgeID: isEditing ? selectedBadge.badgeID : null,
            badgeName,
            description: badgeDescription,
            courseID: selectedCourse.courseID,
        };

        try {
            if (isEditing) {
                // Update existing badge
                const updatedBadge = await createOrUpdateBadge(newBadge);
                const updatedBadges = badges.map((badge) =>
                    badge.badgeID === selectedBadge.badgeID ? updatedBadge : badge
                );
                setBadges(updatedBadges);
                setNotification(`Badge updated: ${badgeName}`);
            } else {
                // Create new badge
                const createdBadge = await createOrUpdateBadge(newBadge);
                setBadges([...badges, createdBadge]);
                setNotification(`New badge added: ${badgeName}`);
            }
        } catch (error) {
            console.error("Error adding/updating badge:", error);
        }

        setTimeout(() => setNotification(""), 3000);

        // Reset form fields
        setBadgeName("");
        setBadgeDescription("");
        setSelectedBadge(null);
        setIsEditing(false);
        setActiveTab("badges"); // Switch back to the badges tab
    };

    // Handle deleting a badge
    const handleDeleteBadge = async (badgeID) => {
        try {
            await deleteBadge(badgeID);
            const updatedBadges = badges.filter((badge) => badge.badgeID !== badgeID);
            setBadges(updatedBadges);
            setNotification("Badge deleted.");
        } catch (error) {
            console.error("Error deleting badge:", error);
        }

        setTimeout(() => setNotification(""), 3000);
    };

    // Handle editing a badge
    const handleEditBadge = (badge) => {
        setBadgeName(badge.badgeName);
        setBadgeDescription(badge.description);
        setSelectedBadge(badge);
        setIsEditing(true);
        setActiveTab("add-badge"); // Switch to the add-badge tab
    };

    // Handle viewing a badge
    const handleViewBadge = (badge) => {
        setSelectedBadge(badge);
        setShowModal(true);
    };

    // Handle adding a new badge
    const handleAddNewBadge = () => {
        setBadgeName("");
        setBadgeDescription("");
        setSelectedBadge(null);
        setIsEditing(false);
        setActiveTab("add-badge"); // Switch to the add-badge tab
    };

    // Handle selecting a course from the dropdown
    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
    };

    return (
        <Container className="mt-5">
            {/* Tab Navigation */}
            <Nav variant="tabs" activeKey={activeTab} className="mb-4 border-light">
                <Nav.Item>
                    <Nav.Link eventKey="badges" onClick={() => setActiveTab("badges")}>
                        <FaList className="me-2" /> Badges
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="add-badge" onClick={handleAddNewBadge}>
                        <FaPlus className="me-2" /> {isEditing ? "Edit Badge" : "Add Badge"}
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Notification */}
            {notification && (
                <Alert variant="info" className="text-center shadow-sm">
                    {notification}
                </Alert>
            )}

            {/* Badges Tab */}
            {activeTab === "badges" && (
                <>
                    <h2 className="mb-3 text-light">Badges</h2>
                    {badges.length === 0 ? (
                        <Alert variant="info" className="text-light">No badges available.</Alert>
                    ) : (
                        <ListGroup className="shadow-sm rounded bg-dark text-light">
                            {badges.map((badge) => (
                                <ListGroup.Item
                                    key={badge.badgeID}
                                    className="d-flex justify-content-between align-items-center bg-secondary"
                                >
                                    <div>
                                        <Badge bg="primary" className="me-2">
                                            {badge.badgeName}
                                        </Badge>
                                        <small className="text-muted">{badge.description}</small>
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewBadge(badge)}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditBadge(badge)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteBadge(badge.badgeID)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </>
            )}

            {/* Add/Edit Badge Tab */}
            {activeTab === "add-badge" && (
                <>
                    <h2 className="mb-3 text-light">{isEditing ? "Edit Badge" : "Add Badge"}</h2>
                    <Form onSubmit={handleAddOrUpdateBadge} className="shadow-sm p-4 rounded bg-dark text-light">
                        {/* Course Dropdown */}
                        <Form.Group className="mb-3">
                            <Form.Label>Choose Course</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-course" className="bg-secondary text-light border-light">
                                    {selectedCourse ? selectedCourse.courseName : "Select Course"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="bg-dark text-light">
                                    {courses.map((course) => (
                                        <Dropdown.Item
                                            key={course.courseID}
                                            onClick={() => handleSelectCourse(course)}
                                            className="bg-dark text-light"
                                        >
                                            {course.courseName}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Badge Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter badge name"
                                value={badgeName}
                                onChange={(e) => setBadgeName(e.target.value)}
                                className="bg-secondary text-light border-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter badge description"
                                value={badgeDescription}
                                onChange={(e) => setBadgeDescription(e.target.value)}
                                className="bg-secondary text-light border-light"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            {isEditing ? "Update Badge" : "Add Badge"}
                        </Button>
                    </Form>
                </>
            )}

            {/* View Badge Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="bg-dark">
                <Modal.Header closeButton>
                    <Modal.Title>Badge Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBadge && (
                        <>
                            <p><strong>Name:</strong> {selectedBadge.badgeName}</p>
                            <p><strong>Description:</strong> {selectedBadge.description}</p>
                            <p><strong>Course:</strong> {courses.find(course => course.courseID === selectedBadge.courseID)?.courseName}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>

    );
};

export default CourseBadgeManagement;
