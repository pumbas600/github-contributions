import { Box, IconButton, Paper, Tooltip, styled } from '@mui/material';
import Check from '@mui/icons-material/Check';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { useEffect, useState } from 'react';
import '@fontsource/fira-code';

interface CodeBlockProps {
    code: string;
}

const Pre = styled('pre')(({ theme }) => ({
    padding: theme.spacing(2),
    lineHeight: '1.4rem',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    margin: 0,
}));

const Code = styled('code')({
    fontFamily: '"Fira Code",monospace',
    fontSize: '0.9rem',
});

const CopyButton = styled(IconButton)<{ isCopied: boolean }>(({ theme, isCopied }) => ({
    position: 'absolute',
    right: 8,
    top: 10,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid`,
    borderColor: isCopied ? theme.palette.success.main : theme.palette.divider,
    color: isCopied ? theme.palette.success.main : undefined,
    '&:hover': {
        // Prevent default hover color
        backgroundColor: theme.palette.background.paper,
    },
    '& > svg': {
        width: '0.9em',
        height: '0.9em',
    },
}));

const CodeContainer = styled(Box)({
    position: 'relative',
    '& > button': {
        visibility: 'hidden',
    },
    '&:hover > button': {
        visibility: 'visible',
    },
});

export default function CodeBlock({ code }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied) {
            const timeout = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [isCopied]);

    const handleClick = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
    };

    return (
        <CodeContainer>
            <Pre>
                <Code>{code}</Code>
            </Pre>
            <Tooltip title="Copied" open={isCopied} arrow placement="left">
                <CopyButton
                    size="small"
                    isCopied={isCopied}
                    aria-label="Copy"
                    onClick={handleClick}
                    sx={isCopied ? { visibility: 'visible !important' } : {}}
                >
                    {isCopied ? <Check /> : <ContentCopy />}
                </CopyButton>
            </Tooltip>
        </CodeContainer>
    );
}
