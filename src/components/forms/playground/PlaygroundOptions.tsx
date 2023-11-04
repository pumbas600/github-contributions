import GitHubCard from '@/components/cards/GitHubCard';
import Subtitle from '@/components/typography/Subtitle';
import { TextField } from '@mui/material';
import LabelledInput from '../input/LabelledInput';

interface PlaygroundOptionsProps {
    username: string;
    onUsernameChange: (username: string) => void;
}

export default function PlaygroundOptions({ username, onUsernameChange }: PlaygroundOptionsProps) {
    return (
        <GitHubCard>
            <Subtitle>Options</Subtitle>
            <TextField
                size="medium"
                spellCheck={false}
                required
                fullWidth
                label="GitHub username"
                placeholder="E.g. pumbas600"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
            />
            <LabelledInput
                label="Test"
                Input={TextField}
                inputProps={{ name: 'test', placeholder: 'Placeholder...' }}
            />
        </GitHubCard>
    );
}
