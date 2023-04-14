import { Box, IconButton, Tooltip, styled } from '@mui/material';
import { Check, ContentCopy } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import '@fontsource/fira-code';

interface CodeBlockProps {
    code: string;
}

const Pre = styled('pre')(({ theme }) => ({
    padding: theme.spacing(2),
    lineHeight: '1.4rem',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    margin: 0,
}));

const Code = styled('code')({
    fontFamily: '"Fira Code",monospace',
    fontSize: '0.9rem',
});

const CopyButtonContainer = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: 4,
    top: 5,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid`,
    borderColor: 'transparent',
    '&:hover': {
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
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
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [copied]);

    const handleClick = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
    };

    return (
        <CodeContainer>
            <Pre>
                <Code>{code}</Code>
            </Pre>
            <Tooltip title="Copied" open={copied} arrow placement="left">
                <CopyButtonContainer aria-label="Copy" onClick={handleClick} color={copied ? 'success' : undefined}>
                    {copied ? <Check /> : <ContentCopy />}
                </CopyButtonContainer>
            </Tooltip>
        </CodeContainer>
    );
}
