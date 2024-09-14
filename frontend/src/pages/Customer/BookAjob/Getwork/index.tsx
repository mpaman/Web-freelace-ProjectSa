import { useState, useEffect } from "react";
import { Table, Col, Row, Divider, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetSubmissions, GetUserById, GetWorkById } from "../../../../services/https/index";
import { SubmissionInterface } from "../../../../interfaces/submission";
import { UsersInterface } from "../../../../interfaces/IUser";
import { WorkInterface } from "../../../../interfaces/work";

function Getsent() {
    const [submissions, setSubmissions] = useState<SubmissionInterface[]>([]);
    const [users, setUsers] = useState<Record<number, UsersInterface>>({});
    const [works, setWorks] = useState<Record<number, WorkInterface>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ColumnsType<SubmissionInterface> = [
        {
            title: "ID ผู้ใช้",
            dataIndex: "booker_user_id",
            key: "booker_user_id",
        },
        {
            title: "ชื่อผู้ใช้",
            key: "user_first_name",
            render: (text, record) => (
                <>
                    {users[record.booker_user_id]
                        ? `${users[record.booker_user_id].first_name}`
                        : "ไม่ระบุ"}
                </>
            ),
        },
        {
            title: "นามสกุลผู้ใช้",
            key: "user_last_name",
            render: (text, record) => (
                <>
                    {users[record.booker_user_id]
                        ? `${users[record.booker_user_id].last_name}`
                        : "ไม่ระบุ"}
                </>
            ),
        },
        {
            title: "ชื่องาน",
            key: "work_info",
            render: (text, record) => (
                <>
                    {works[record.work_id] ? works[record.work_id].info : "ไม่ระบุ"}
                </>
            ),
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
    ];

    const getUserById = async (userId: number) => {
        try {
            let res = await GetUserById(userId);
            if (res.status === 200) {
                setUsers(prevUsers => ({
                    ...prevUsers,
                    [userId]: res.data
                }));
            }
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            messageApi.open({
                type: "error",
                content: `เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้ ${userId}`,
            });
        }
    };

    const getWorkById = async (workId: number) => {
        try {
            let res = await GetWorkById(workId);
            if (res.status === 200) {
                setWorks(prevWorks => ({
                    ...prevWorks,
                    [workId]: res.data
                }));
            }
        } catch (error) {
            console.error(`Error fetching work ${workId}:`, error);
            messageApi.open({
                type: "error",
                content: `เกิดข้อผิดพลาดในการดึงข้อมูลงาน ${workId}`,
            });
        }
    };

    const getSubmissions = async () => {
        setLoading(true);
        try {
            let res = await GetSubmissions();
            console.log("API Response:", res); // ตรวจสอบข้อมูลที่ได้รับ
            if (res.status === 200) {
                const submissionsData = res.data;
                setSubmissions(submissionsData);

                // ดึงข้อมูลผู้ใช้ทั้งหมดที่เกี่ยวข้อง
                const userIds = Array.from(new Set(submissionsData.map(submission => submission.booker_user_id)));
                for (const userId of userIds) {
                    await getUserById(userId);
                }

                // ดึงข้อมูลงานทั้งหมดที่เกี่ยวข้อง
                const workIds = Array.from(new Set(submissionsData.map(submission => submission.work_id)));
                for (const workId of workIds) {
                    await getWorkById(workId);
                }
            } else {
                setSubmissions([]);
                messageApi.open({
                    type: "error",
                    content: res.data.error || "เกิดข้อผิดพลาดในการดึงข้อมูล",
                });
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            });
        } finally {
            setLoading(false);
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
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={submissions}
                        style={{ width: "100%", overflow: "scroll" }}
                    />
                )}
            </div>
        </>
    );
}

export default Getsent;
