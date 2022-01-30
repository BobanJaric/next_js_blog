import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import styles from '../../styles/Post.module.css';
import BlockContent from '@sanity/block-content-to-react';
import { Toolbar } from '../../components/toolbar';

const Post = ({ title, body, image }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const imgBuilder = imageUrlBuilder({
            projectId: '',
            dataset: 'production',
        });

        setImageUrl(imgBuilder.image(image));
    }, [image]);
    return (
        < div >
            <Toolbar />
            < div className="grid place-items-center h-screen m-10 w-auto rounded overflow-hidden shadow-lg mb-5 " >
                <h1 className='mb-5'>{title}</h1>
                {imageUrl && <img src={imageUrl} className="rounded mb-5 "  />}
                <BlockContent blocks={body} />
            </div>
        </ div>
    );
}

export const getServerSideProps = async pageContext => {
    const pageSlug = pageContext.query.slug;

    if (!pageSlug) {
        return {
            notFound: true
        }
    }

    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
    const url = `https://.api.sanity.io/v1/data/query/production?query=${query}`;

    const result = await fetch(url).then(res => res.json());
    const post = result.result[0];

    if (!post) {
        return {
            notFound: true
        }
    } else {
        return {
            props: {
                body: post.body,
                title: post.title,
                image: post.mainImage,
            }
        }
    }


}


export default Post;