import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";
import { useAuth } from "../../contexts/AuthContext";
import SendBird from "sendbird";
import { useState, useEffect } from "react";

const APP_ID = import.meta.env.VITE_APP_SENDBIRD_APP_ID;

const CHANNEL_URLS = [
  "sendbird_open_channel_23487_3dbd4cc5132d2b919ebf56d869f958320af57067", // 설악산
  "sendbird_open_channel_23487_437ef10bf4986e4defb090f74ecff54788dbc135", // 마이산
  "sendbird_open_channel_23487_76e1ca068ef2af42ad58e1289e1a1c1c6c85a402", // 한라산
];

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatSendbird = () => {
  const { user } = useAuth();
  const [sendbirdInstance, setSendbirdInstance] = useState(null);
  const [activeChannelUrl, setActiveChannelUrl] = useState(null); // 현재 표시할 채널

  const createSendbirdUser = async (userId, nickname) => {
    try {
      const res = await fetch(`${BASE_URL}/api/sendbird/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, nickname }),
      });
      if (!res.ok) {
        console.warn("이미 존재하는 유저일 수 있음:", await res.text());
      } else {
        console.log("Sendbird 유저 생성 성공");
      }
    } catch (err) {
      console.error("Sendbird 유저 생성 실패:", err);
    }
  };

  useEffect(() => {
    if (user?.nickname) {
      const userId = user.nickname;

      const initSendbird = async () => {
        await createSendbirdUser(userId, user.nickname);
        const sb = new SendBird({ appId: APP_ID });

        sb.connect(userId, async (connectedUser, error) => {
          if (error) {
            console.error("Sendbird 연결 실패:", error);
            return;
          }

          console.log("Sendbird 연결 성공:", connectedUser);
          setSendbirdInstance(sb);

          // 여러 오픈채널 자동 참여
          for (let url of CHANNEL_URLS) {
            sb.OpenChannel.getChannel(url, (channel, err) => {
              if (err) {
                console.error(`채널 불러오기 실패: ${url}`, err);
                return;
              }

              channel.enter((enterErr) => {
                if (enterErr) {
                  console.error(`채널 입장 실패: ${url}`, enterErr);
                } else {
                  console.log(`채널 입장 성공: ${channel.name}`);
                }
              });
            });
          }

          // 첫 번째 채널을 표시
          setActiveChannelUrl(CHANNEL_URLS[0]);
        });
      };

      initSendbird();
    }
  }, [user]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {sendbirdInstance && activeChannelUrl && (
        <SendbirdApp
          appId={APP_ID}
          userId={user.nickname}
          channelUrl={activeChannelUrl}
          theme="dark"
          showSearchIcon={true}
          nickname={user?.nickname || "익명"}
        />
      )}
    </div>
  );
};

export default ChatSendbird;
