import { useEffect, useState } from "react";
import { useColorScheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { CardHeader, CardContent, Divider } from "@mui/material";
import { HardDrive, SettingsIcon } from "lucide-react";
import { useLocalStorageState } from "@toolpad/core/useLocalStorageState";
import { useNotifications } from "@toolpad/core/useNotifications";

import "./SystemInfo.css";
import { useSystemInfo } from "../../../context/SystemInfoContext";
import { useCustomMUIProps } from "../../../context/CustomMUIPropsContext";
import SystemInfoChart from "./SystemInfoChart";
import { useSocket } from "../../../context/Socket";
import SystemStatsCard from "./SystemStatsCard";

const TIME_INTERVAL_IN_SEC = 2;
const DATA_POINTS_LENGTH = 65 / TIME_INTERVAL_IN_SEC;
const START_POINT =
  -(DATA_POINTS_LENGTH * TIME_INTERVAL_IN_SEC) + TIME_INTERVAL_IN_SEC;

const SystemInfo = () => {
  const { cardProps } = useCustomMUIProps();
  const systemInfoControls = useSystemInfo();
  const { colorScheme } = useColorScheme();
  const notifications = useNotifications();

  const [hostAddress] = useLocalStorageState("hostAddress");

  const onIconClick = () => {
    systemInfoControls.setDebugList((prev) => [...prev, 0]);
  };

  const createInitialPoints = () => {
    return Array.from({ length: DATA_POINTS_LENGTH }, (_, idx) => ({
      timeStep: START_POINT + TIME_INTERVAL_IN_SEC * idx,
      cpu_percent: 0,
      ram_percent: 0,
      ram_gb: 0,
      free_ram_percent: 0,
      free_ram_gb: 0,
      free_ram_mb: 0,
    }));
  };

  const initialData = createInitialPoints();
  const [chartSeries, setChartSeries] = useState(initialData);
  const { socket, socketConnected } = useSocket();

  useEffect(() => {
    if (!socket || !socket.connected || !socketConnected) return;

    socket.on("system_info", (data) => {
      setChartSeries((prev) => {
        const incoming = { ...data };

        const last = [...prev, incoming].slice(-DATA_POINTS_LENGTH);

        return last.map((item, idx) => ({
          ...item,
          timeStep: START_POINT + TIME_INTERVAL_IN_SEC * idx,
        }));
      });
    });
  }, [socket, socketConnected]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await systemInfoControls.fetchRAM(
        hostAddress,
        notifications,
        systemInfoControls
      );
    }, 1000);

    systemInfoControls.setPollingIntervals((prev) => [...prev, interval]);

    return () => clearInterval(interval);
  }, [hostAddress]);

  return (
    <Card
      className={`system-info-card ${colorScheme}-bordered-container`}
      sx={{
        ...cardProps,
        color:
          colorScheme === "light" ? "var(--dark-text)" : "var(--light-text)",
      }}
    >
      <div className="card-header-container">
        <CardHeader
          avatar={<HardDrive onClick={onIconClick} />}
          title="System Information"
          className={`card-header card-header-${colorScheme}`}
          sx={{
            padding: 0,
          }}
        />
        <span
          className={`card-header-description card-header-description-${colorScheme}`}
        >
          Live CPU and RAM usage for the last minute.
        </span>
      </div>
      <CardContent
        sx={{
          padding: 0,
        }}
      >
        <div className="system-info-container">
          <SystemInfoChart series={chartSeries} />
          <Divider sx={{ marginY: "20px" }} />
          <SystemStatsCard
            stats={chartSeries[chartSeries.length - 1]}
            colorScheme={colorScheme}
            note={
              "To operate one account you need approximately 500MB of RAM. Could not determine account capacity due to unavailable RAM information."
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfo;
