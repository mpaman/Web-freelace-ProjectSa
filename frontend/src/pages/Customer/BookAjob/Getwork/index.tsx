import { useState, useEffect } from "react";
import { Table, message, Spin ,Button} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams,useNavigate} from "react-router-dom";
import { GetSubmissionsByWorkID, GetUserById, GetWorkById,GetWagesByWorkID} from "../../../../services/https/index";
import { SubmissionInterface } from "../../../../interfaces/submission";
import { UsersInterface } from "../../../../interfaces/IUser";
import { WorkInterface } from "../../../../interfaces/work";
import videoBg from "../../../../assets/back.mp4";

function ManageSubmissions() {
    const { workID } = useParams<{ workID: string }>();
    const [submissions, setSubmissions] = useState<SubmissionInterface[]>([]);
    const [users, setUsers] = useState<Record<number, UsersInterface>>({});
    const [works, setWorks] = useState<Record<number, WorkInterface>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const columns: ColumnsType<SubmissionInterface> = [
        // {
        //     title: "ID ผู้ใช้",
        //     dataIndex: "booker_user_id",
        //     key: "booker_user_id",
        // },
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
        {
            title: "ชำระเงิน",
            key: "payment_action",
            render: (record) => (
                <Button
                    type="primary"
                    onClick={() => handlePayment(record)}
                    disabled={!record.file_link} // Disable if there's no file link
                >
                    ชำระเงิน
                </Button>
            ),
        },
    ];
    const handlePayment = async (record: SubmissionInterface) => {
        const { work_id, booker_user_id, poster_user_id } = record;
    
        try {
            // เรียกใช้ GetWagesByWorkID เพื่อดึงค่าจ้าง
            const wages = await GetWagesByWorkID(work_id);
    
            if (wages !== null) {
                // ถ้าได้ค่าจ้างมาแล้ว จะแสดง message และนำทางไปที่หน้า payment พร้อมส่งข้อมูลทั้งหมดไป
                console.log(`Navigating to /payment with workId: ${work_id}, bookerUserId: ${booker_user_id}, posterUserId: ${poster_user_id}, wages: ${wages}`);
                messageApi.open({
                    type: "info",
                    content: `กำลังนำไปสู่หน้าชำระเงินสำหรับงาน ID: ${work_id} โดยผู้ใช้ ID: ${booker_user_id}`,
                });
                navigate('/payment', {
                    state: {
                        workId: work_id,
                        bookerUserId: booker_user_id,
                        posterUserId: poster_user_id,
                        wages: wages, // ส่ง wages ไปด้วย
                    },
                });
            } else {
                throw new Error("ไม่สามารถดึงค่าจ้างได้");
            }
        } catch (error) {
            console.error("Error fetching wages:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการดึงค่าจ้าง",
            });
        }
    };

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
                    const userIds = Array.from(new Set(submissionsData.map((submission: { booker_user_id: any; }) => submission.booker_user_id)));
                    for (const userId of userIds) {
                        await getUserById(userId);
                    }

                    // ดึงข้อมูลงานทั้งหมดที่เกี่ยวข้อง
                    const workIds = Array.from(new Set(submissionsData.map((submission: { work_id: any; }) => submission.work_id)));
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
            {/* Background video */}
            <video
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
                    filter: "brightness(0.6)",
                }}
            >
                <source src={videoBg} type="video/mp4" />
            </video>
            <h2>จัดการการส่งงานสำหรับงาน ID: {workID}</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={submissions}

                />
            )}
        </>
    );
}

export default ManageSubmissions;