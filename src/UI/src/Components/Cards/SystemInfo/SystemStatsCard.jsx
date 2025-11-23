import PropTypes from "prop-types";
import { Paper, Box, Typography, Stack, Avatar, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
const statsMap = [
  {
    percentageKey: "cpu_percent",
    label: "CPU Usage",
    icon: <SettingsIcon fontSize="small" />,
  },
  {
    percentageKey: "ram_percent",
    valueKey: "ram_gb",
    label: "RAM Usage",
    icon: <MemoryIcon fontSize="small" />,
  },
  {
    percentageKey: "free_ram_percent",
    valueKey: "free_ram_gb",
    label: "Free RAM",
    icon: <StorageIcon fontSize="small" />,
  },
];
export default function SystemStatsCard({ stats, note, sx, colorScheme }) {
  return (
    <Stack spacing={1.25}>
      {statsMap.map((s, i) => (
        <Box
          key={s.label + i}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "transparent",
                opacity: 0.80,
                color: `inherit`
              }}
            >
              {s.icon}
            </Avatar>

            <Box>
              <Typography sx={{ fontSize: 13, opacity: 0.75 }}>
                {s.label}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems:"center", gap:1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                fontFamily:
                  "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
              }}
            >
              {Number(stats[s.percentageKey])?.toFixed(1)} %
            </Typography>
            {s.valueKey && (
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  opacity: 0.75,
                  fontFamily:
                    "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
                }}
              >
                {"("}{Number(stats[s.valueKey])?.toFixed(2)} GB{")"}
              </Typography>
            )}
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 20 }} />

      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        <InfoOutlinedIcon
          sx={{ color: "inherit", ml: "7px" }}
          fontSize="small"
        />
        <Typography sx={{ fontSize: 12, color: "inherit" }}>
          {note}
        </Typography>
      </Box>
    </Stack>
  );
}

SystemStatsCard.propTypes = {
  stats: PropTypes.array,
  note: PropTypes.string,
  sx: PropTypes.object,
};

SystemStatsCard.defaultProps = {
  stats: [
    {
      label: "CPU Usage",
      valueText: "67.3%",
      subText: null,
      icon: <SettingsIcon fontSize="small" />,
    },
    {
      label: "RAM Usage",
      valueText: "48.0% (7.69 GB)",
      subText: null,
      icon: <MemoryIcon fontSize="small" />,
    },
    {
      label: "Free RAM",
      valueText: "52.0% (8.31 GB)",
      subText: null,
      icon: <StorageIcon fontSize="small" />,
    },
  ],
  note: "To operate one account you need approximately 500MB of RAM. Could not determine account capacity due to unavailable RAM information.",
};
