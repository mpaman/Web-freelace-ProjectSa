import { useState, useEffect } from "react";
import { Table, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { GetSubmissionsByWorkID, GetUserById, GetWorkById } from "../../../../services/https/index";
import { SubmissionInterface } from "../../../../interfaces/submission";
import { UsersInterface } from "../../../../interfaces/IUser";
import { WorkInterface } from "../../../../interfaces/work";

function ManageSubmissions() {
    const { workID } = useParams<{ workID: string }>();
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
            key: "user_name",
            render: (record) => (
                <>
                    {users[record.booker_user_id]
                        ? `${users[record.booker_user_id].first_name} ${users[record.booker_user_id].last_name}`
                        : "ไม่ระบุ"}
                </>
            ),
        },
        {
            title: "ชื่องาน",
            key: "work_info",
            render: (record) => (
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
            render: (record) => {
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
        if (workID) {
            setLoading(true);
            try {
                let res = await GetSubmissionsByWorkID(workID);
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
        }
    };

    useEffect(() => {
        getSubmissions();
    }, [workID]);

    return (
        <>
            {contextHolder}
            <h2>จัดการการส่งงานสำหรับงาน ID: {workID}</h2>
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
        </>
    );
}

export default ManageSubmissions;
