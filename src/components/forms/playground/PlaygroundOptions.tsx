import GitHubCard from '@/components/cards/GitHubCard';
import Subtitle from '@/components/typography/Subtitle';
import { TextField } from '@mui/material';
import LabelledInput from '../input/LabelledInput';
import ColourField from '../ColourField';

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
            <LabelledInput name="test" label="Test" Input={TextField} inputProps={{ placeholder: 'Placeholder...' }} />
            <LabelledInput
                name="colour"
                label="Colour"
                Input={ColourField}
                inputProps={{ value: '#000000', onChange: console.log }}
            />
        </GitHubCard>
    );
}
