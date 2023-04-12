import { styled } from '@mui/material';
import '@fontsource/fira-code';

interface CodeBlockProps {
    code: string;
}

const Pre = styled('pre')(({ theme }) => ({
    padding: theme.spacing(2),
    lineHeight: '1.45rem',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
}));

const Code = styled('code')({
    fontFamily: '"Fira Code",monospace',
});

export default function CodeBlock({ code }: CodeBlockProps) {
    return (
        <Pre>
            <Code>{code}</Code>
        </Pre>
    );
}
