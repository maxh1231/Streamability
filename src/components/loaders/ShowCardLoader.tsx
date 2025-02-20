import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ShowCardLoaderProps {
    /**
     * Number of skeleton loaders to display
     */
    count: number;
}

/**
 * A skeleton loader of the show card component. To be rendered while
 * main component is loading.
 * @param count | number of card placeholders to be rendered
 * @returns {JSX.Element}
 */
const ShowCardLoader: React.FC<ShowCardLoaderProps> = ({ count }): JSX.Element => {
    return (
        <>
            {[...Array(count)].map((x, i) => (
                <div key={i} className='flex w-80 mx-auto my-2'>
                    <Skeleton width={175} height={270} className='mb-2' />
                    <div className='flex flex-col justify-between py-1 pl-2'>
                        <div>
                            <Skeleton width={120} height={30} count={1} />
                            <Skeleton width={120} count={1} />
                        </div>
                        <Skeleton width={120} count={2} />
                    </div>
                </div>
            ))}
        </>
    );
};

export default ShowCardLoader;
