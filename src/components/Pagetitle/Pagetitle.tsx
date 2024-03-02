import { Helmet } from 'react-helmet-async';


export default function Pagetitle({ title }: { title: string }) {
    return (
        <Helmet>
            <title>
                Community | {title}
            </title>
        </Helmet>
    );
}