import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CardHeader, Card } from "@mui/material";
import { useColorScheme } from '@mui/material/styles';
import { Terminal } from "lucide-react";

import { useAppState } from '../../context/AppStateContext';
import Log from './Log';

const LogsCard = () => {
    const { logs } = useAppState();
    const { colorScheme } = useColorScheme();
    const scrollRef = useRef(null);

    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [logs]);

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: "var(--border-radius)",
                backgroundColor: colorScheme === 'light' ? "var(--white)" : "var(--gray)",
                backgroundImage: "none",
                overflow: 'hidden',
            }}
            className={`logs-box-container ${colorScheme}-bordered-container`}
        >
            <CardHeader
                title="Live Log Feed"
                avatar={<Terminal size={20} />}
                sx={{
                    padding: "1.5rem",
                    "& .MuiTypography-root": {
                        fontWeight: "bold",
                        fontSize: "1rem",
                        letterSpacing: "-0.025rem",
                    }
                }}
            />
            <Box
                ref={scrollRef}
                sx={{
                    height: '100%',
                    overflow: 'scroll',
                    p: 2,
                    "&.MuiBox-root": {
                        padding: "0 1.5rem 1.5rem 1.5rem",
                    }
                }}
            >
                <Stack

                    sx={{
                        overflow: 'scroll',
                    }}
                >
                    {
                        logs.map((log, index) => (
                            <Log key={index} log={log} />
                        ))
                    }
                </Stack>
            </Box>
        </Card >
    );
};

export default LogsCard;