import GitHubCard from '@/components/cards/GitHubCard';
import Playground from '@/components/forms/playground';
import Header from '@/components/header';
import { Container, Grid, styled } from '@mui/material';
import Head from 'next/head';

const ResponsiveContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),

    [theme.breakpoints.down('md')]: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));

const Title = 'GitHub Contributions Playground';
const Description =
    'A playground for previewing the styling of GitHub contribution graphs and generating the code for embedding them in Markdown and HTML.';

export default function Home() {
    return (
        <>
            <Head>
                <title>{Title}</title>
                <meta name="description" content={Description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />

                <meta property="og:title" content={Title} />
                <meta property="og:type" content="website" />
                {/* og:image doesn't support relative paths unfortunately and we don't have access to `window`...  */}
                <meta property="og:image" content="https://github.pumbas.net/contributionsGraph.png" />
                <meta property="og:url" content="https://github.pumbas.net" />
                <meta name="twitter:card" content="summary_large_image" />

                <meta property="og:description" content={Description} />
                <meta property="og:site_name" content="GitHub Contributions" />
                <meta name="og:image:alt" content="An example contributions graph" />
            </Head>
            <main>
                <ResponsiveContainer maxWidth="lg">
                    <Header />
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={4}>
                            <GitHubCard>Options :)</GitHubCard>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <Playground />
                        </Grid>
                    </Grid>
                </ResponsiveContainer>
            </main>
        </>
    );
}
