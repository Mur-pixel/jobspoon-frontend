// JoinedStudyRoom.tsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { StudyRoom } from "../types/study";
import { FAKE_STUDY_ROOMS } from "../data/mockData";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

type UserRole = "LEADER" | "MEMBER";

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  /* 자식(후손) 라우트에서 공통으로 쓰는 클래스 유지 */
  .room-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
  .leave-button {
    background-color: #ff6b6b;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const HeaderBox = styled.header`
  background-color: ${({ theme }) => theme.surface};
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;

  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: ${({ theme }) => theme.fg};
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.subtle};
  }
`;

const Main = styled.main`
  display: flex;
  gap: 24px;
`;

const Sidebar = styled.nav`
  flex: 0 0 200px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: fit-content;
`;

const SidebarLink = styled(NavLink)`
  color: ${({ theme }) => theme.fg};
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 6px;
  transition: background-color 0.2s;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.surfaceHover};
  }
  &.active {
    background-color: ${({ theme }) => theme.accent ?? theme.primary};
    color: #fff;
  }
`;

const ContentArea = styled.section`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 24px;
  min-height: 400px;
`;

const JoinedStudyRoom: React.FC = () => {
    const { id: studyId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUserId } = useAuth();
    const [study, setStudy] = useState<StudyRoom | null>(null);
    const [userRole, setUserRole] = useState<UserRole>("MEMBER");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studyId) return;
        const fetchStudyDetails = async () => {
            try {
                const response = await axiosInstance.get<StudyRoom>(`/study-rooms/${studyId}`);
                setStudy(response.data);
                // 모임장 ID와 현재 사용자 ID를 비교하여 역할 결정
                if (response.data.hostId === currentUserId) {
                    setUserRole("LEADER");
                } else {
                    setUserRole("MEMBER");
                }
            } catch (error) {
                console.error("스터디 정보 로딩 실패:", error);
                alert("스터디 정보를 불러올 수 없습니다.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchStudyDetails();
    }, [studyId, currentUserId, navigate]);

    const handleLeaveOrClose = async () => {
        if (userRole === "LEADER") {
            if (window.confirm("정말로 스터디를 폐쇄하시겠습니까? 모든 데이터가 삭제됩니다.")) {
                try {
                    await axiosInstance.delete(`/study-rooms/${studyId}`);
                    alert("스터디가 폐쇄되었습니다.");
                    navigate("/my-studies"); // 내 스터디 목록으로 이동
                } catch (error) {
                    alert("스터디 폐쇄에 실패했습니다.");
                }
            }
        } else {
            if (window.confirm("정말로 스터디에서 탈퇴하시겠습니까?")) {
                try {
                    await axiosInstance.delete(`/study-rooms/${studyId}/membership`);
                    alert("스터디에서 탈퇴 처리되었습니다.");
                    navigate("/my-studies");
                } catch (error) {
                    alert("스터디 탈퇴에 실패했습니다.");
                }
            }
        }
    };

    if (loading || !study) {
        return <div>스터디 정보를 불러오는 중...</div>;
    }

    return (
        <Container>
            <HeaderBox className="room-header">
                <h2>{study.title}</h2>
                <p>
                    모임장: {study.hostId} | 인원 {study.currentMembers}/{study.maxMembers} | 진행방식:{" "}
                    {study.location}
                </p>
            </HeaderBox>

            <Main className="room-main-content">
                <Sidebar className="room-sidebar">
                    <SidebarLink to="" end>
                        공지사항
                    </SidebarLink>
                    <SidebarLink to="schedule">일정관리</SidebarLink>
                    <SidebarLink to="interview">모의면접</SidebarLink>
                    <SidebarLink to="members">참여인원</SidebarLink>
                </Sidebar>

                <ContentArea className="room-content-area">
                    <Outlet context={{ userRole, onLeaveOrClose: handleLeaveOrClose }} />
                </ContentArea>
            </Main>
        </Container>
    );
};

export default JoinedStudyRoom;
