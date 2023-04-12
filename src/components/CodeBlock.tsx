import { IconButton, styled } from '@mui/material';
import '@fontsource/fira-code';
import { Check, ContentCopy } from '@mui/icons-material';
import { useEffect, useState } from 'react';

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
}));

const Code = styled('code')({
    fontFamily: '"Fira Code",monospace',
    fontSize: '0.9rem',
});

const CopyButtonContainer = styled('span')(({ theme }) => ({
    position: 'absolute',
    right: 4,
    top: 5,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid`,
    borderColor: 'transparent',
    '&:hover': {
        borderColor: theme.palette.divider,
    },
}));

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
        <Pre>
            <CopyButtonContainer>
                <IconButton aria-label="Copy" onClick={handleClick} color={copied ? 'success' : undefined}>
                    {copied ? <Check /> : <ContentCopy />}
                </IconButton>
            </CopyButtonContainer>
            <Code>{code}</Code>
        </Pre>
    );
}
