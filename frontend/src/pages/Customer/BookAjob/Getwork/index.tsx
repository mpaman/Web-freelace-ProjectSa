import { useState, useEffect } from "react";
import { Table, Col, Row, Divider, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetSubmissions } from "../../../../services/https/index";
import { SubmissionInterface } from "../../../../interfaces/submission";

const apiUrl = "http://localhost:8000";

function Getsent() {
    const [submissions, setSubmissions] = useState<SubmissionInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ColumnsType<SubmissionInterface> = [
        {
            title: "ID ผู้ใช้",
            dataIndex: "booker_user_id",
            key: "booker_user_id",
        },
        {
            title: "ID งาน",
            dataIndex: "work_id",
            key: "work_id",
        },
        {
            title: "ชื่อผู้ใช้",
            key: "user_first_name",
            render: (text, record) => <>{record?.User?.first_name}</>,
        },
        {
            title: "นามสกุลผู้ใช้",
            key: "user_last_name",
            render: (text, record) => <>{record?.User?.last_name}</>,
        },
        {
            title: "ชื่องาน",
            key: "work_info",
            render: (text, record) => <>{record?.Work?.info}</>,
        },
        {
            title: "ไฟล์งาน",
            dataIndex: "file_link",
            key: "file_link",
        },
        {
            title: "ตรวจสอบงาน",
            key: "file_link_action",
            render: (text, record) => {
                return record.file_link ? (
                    <a href={record.file_link} target="_blank" rel="noopener noreferrer">
                        ตรวจสอบงาน
                    </a>
                ) : (
                    "ไม่มีไฟล์"
                );
            },
        },
        // {
        //     title: "ไฟล์งาน",
        //     key: "file_link",
        //     dataIndex: "file_link",
        //     render: (text) => text ? <a href={`${apiUrl}/uploads/${text}`} target="_blank" rel="noopener noreferrer">{text}</a> : "No file link available",
        // },
    ];

    const getSubmissions = async () => {
        try {
            let res = await GetSubmissions();
            console.log("API Response:", res); // ตรวจสอบข้อมูลที่ได้รับ
            if (res.status === 200) {
                setSubmissions(res.data);
            } else {
                setSubmissions([]);
                messageApi.open({
                    type: "error",
                    content: res.data.error,
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Error fetching submissions.",
            });
        }
    };
    

    useEffect(() => {
        getSubmissions();
    }, []);

    return (
        <>
            {contextHolder}
            <Row>
                <Col span={12}>
                    <h2>รายการส่งงาน (Submissions)</h2>
                </Col>
            </Row>
            <Divider />
            <div style={{ marginTop: 20 }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={submissions}
                    style={{ width: "100%", overflow: "scroll" }}
                />
            </div>
        </>
    );
}

export default Getsent;