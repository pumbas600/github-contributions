import { OptionsService } from '@/services/OptionsService';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
    const options = OptionsService.getOptions();

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <img
                    src={`/api/contributions/pumbas600`}
                    alt="pumbas600's contributions"
                    width={options.width}
                    height={options.height}
                />
            </main>
        </>
    );
}
