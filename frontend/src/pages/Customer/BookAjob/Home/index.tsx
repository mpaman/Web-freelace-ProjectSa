import { useState, useEffect } from "react";
import { Col, Row, Divider, message, Input, Typography, Select, Avatar, Pagination } from "antd";
import { GetPostwork } from "../../../../services/https/index";
import { PostworkInterface } from "../../../../interfaces/Postwork";
import { useNavigate } from "react-router-dom";
// import videoBg from "../../../../assets/back.mp4";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

function PostworkList() {
    const [postworks, setPostworks] = useState<PostworkInterface[]>([]);
    const [filteredPostworks, setFilteredPostworks] = useState<PostworkInterface[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 5; // Number of items per page

    const getPostworks = async () => {
        try {
            let res = await GetPostwork();
            if (res.status === 200) {
                setPostworks(res.data);
                setFilteredPostworks(res.data);

                // Extract unique categories
                const uniqueCategories = Array.from(
                    new Set(res.data.map((postwork) => postwork.Work?.category || ''))
                ).filter((category) => category !== ''); // Remove empty categories if any
                setCategories(uniqueCategories);
            } else {
                setPostworks([]);
                setFilteredPostworks([]);
                messageApi.open({
                    type: "error",
                    content: res.data.error,
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Failed to fetch postworks",
            });
        }
    };

    const handlePostClick = (postId: number) => {
        navigate(`/post/${postId}`); // Navigate to PostPage with postId
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const filtered = postworks.filter(
            (postwork) =>
                postwork.User?.first_name.toLowerCase().includes(value.toLowerCase()) ||
                postwork.User?.last_name.toLowerCase().includes(value.toLowerCase()) ||
                postwork.Work?.info.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPostworks(
            selectedCategory
                ? filtered.filter((postwork) => postwork.Work?.category === selectedCategory)
                : filtered
        );
        setCurrentPage(1); // Reset to the first page after search
    };

    const handleSelectChange = (value: string | null) => {
        setSelectedCategory(value);
        const filtered = postworks.filter(
            (postwork) =>
                (!value || postwork.Work?.category === value) &&
                (!searchTerm ||
                    postwork.User?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    postwork.User?.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPostworks(filtered);
        setCurrentPage(1); // Reset to the first page after filter
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        getPostworks();
    }, []);

    // Calculate the items for the current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPostworks = filteredPostworks.slice(startIndex, endIndex);

    return (
        <>
            {contextHolder}
            {/* <video
                autoPlay
                loop
                muted
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                    filter: "brightness(0.6)", // Reduce brightness for contrast
                }}
            >
                <source src={videoBg} type="video/mp4" />
            </video> */}
            <Row justify="space-between" align="middle">
                <Col>
                    <h2>HOME</h2>
                    <Select
                        placeholder="Select a category"
                        style={{ width: 200, marginTop: 10 }}
                        onChange={handleSelectChange}
                        allowClear
                        value={selectedCategory || undefined} // Ensure controlled value for select
                    >
                        {categories.map((category) => (
                            <Option key={category} value={category}>
                                {category}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Search
                        placeholder="ค้นหาด้วยชื่อ"
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 300 }}
                    />
                </Col>
            </Row>

            <Divider />

            <div style={{ marginTop: 20 }}>
                {currentPostworks.map((postwork) => (
                    <Row key={postwork.ID} style={{ marginBottom: 20 }}>
                        <Col span={24} onClick={() => handlePostClick(postwork.ID)} style={{ cursor: 'pointer' }}>
                            <Row align="middle">
                                <Col>
                                    <Avatar
                                        src={postwork.User?.Profile || undefined}
                                        size={100} // Set the size of the Avatar to 100x100 pixels
                                        style={{ marginRight: 10 }}
                                    />
                                </Col>
                                <Col>
                                    <Typography.Text strong>
                                        {postwork.User?.first_name} {postwork.User?.last_name}
                                    </Typography.Text>
                                </Col>
                            </Row>
                            <TextArea
                                value={postwork.Work?.info || ""}
                                readOnly
                                rows={10}
                                style={{
                                    width: "100%",
                                    marginTop: 5,
                                    paddingTop: 5,
                                }}
                            />
                        </Col>
                    </Row>
                ))}
            </div>

            {/* Pagination */}
            <Row justify="center" style={{ marginTop: 20 }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredPostworks.length}
                    onChange={handlePageChange}
                />
            </Row>
        </>
    );
}

export default PostworkList;
