import NumberField from '@/components/forms/NumberField';
import Row from '@/components/forms/Row';
import { Options } from '@/models/Options';
import { OptionsService } from '@/services/OptionsService';
import { Button, Container, Paper, Stack, TextField, styled } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';

const ContentPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(5, 12),
}));

export default function Home() {
    const [options, setOptions] = useState<Partial<Options>>({});

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Container maxWidth="md">
                    <ContentPaper elevation={1}>
                        <Stack gap={3}>
                            <TextField label="GitHub Username" placeholder="E.g. pumbas600" fullWidth />

                            <Row>
                                <TextField
                                    fullWidth
                                    type="color"
                                    label="Primary Colour"
                                    value={OptionsService.DefaultOptions.color}
                                />
                                <TextField fullWidth type="color" label="Background Colour" />
                            </Row>
                            <Row>
                                <NumberField fullWidth label="Width (px)" />
                                <NumberField type="number" label="Height (px)" />
                            </Row>

                            <Button variant="contained">Generate</Button>
                            <Button>Reset to defaults</Button>
                        </Stack>
                    </ContentPaper>
                </Container>
            </main>
        </>
    );
}
