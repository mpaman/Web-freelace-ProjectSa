import { useState, useEffect } from "react";
import { Col, Row, Divider, message, Input, Typography, Select } from "antd";
import { GetPostwork } from "../../../../services/https/index";
import { PostworkInterface } from "../../../../interfaces/Postwork";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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

    const navigate = useNavigate(); // Use navigate for routing

    const getPostworks = async () => {
        let res = await GetPostwork();

        if (res.status === 200) {
            setPostworks(res.data);
            setFilteredPostworks(res.data);
            const uniqueCategories = Array.from(
                new Set(res.data.map((postwork) => postwork.Work?.category))
            );
            setCategories(uniqueCategories);
        } else {
            setPostworks([]);
            setFilteredPostworks([]);
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (!value) {
            setFilteredPostworks(
                selectedCategory
                    ? postworks.filter((postwork) => postwork.Work?.category === selectedCategory)
                    : postworks
            );
        } else {
            const filtered = postworks.filter(
                (postwork) =>
                    postwork.User?.first_name.toLowerCase().includes(value.toLowerCase()) ||
                    postwork.User?.last_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPostworks(
                selectedCategory
                    ? filtered.filter((postwork) => postwork.Work?.category === selectedCategory)
                    : filtered
            );
        }
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
    };

    const handlePostClick = (postId: number) => {
        navigate(`/post/${postId}`); // Navigate to PostPage with postId
    };

    useEffect(() => {
        getPostworks();
    }, []);

    return (
        <>
            {contextHolder}

            <Row justify="space-between" align="middle">
                <Col>
                    <h2>HOME</h2>
                    <Select
                        placeholder="Select a category"
                        style={{ width: 200, marginTop: 10 }}
                        onChange={handleSelectChange}
                        allowClear
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
                {filteredPostworks.map((postwork) => (
                    <Row
                        key={postwork.ID}
                        style={{ marginBottom: 20, cursor: 'pointer' }}
                        onClick={() => handlePostClick(postwork.ID)} // Link to PostPage
                    >
                        <Col span={24}>
                            <Typography.Text strong>
                                {postwork.User?.first_name} {postwork.User?.last_name}
                            </Typography.Text>
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
        </>
    );
}

export default PostworkList;
