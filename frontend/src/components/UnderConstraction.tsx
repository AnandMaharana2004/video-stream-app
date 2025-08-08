import React from 'react';
import Image from 'next/image';

function UnderConstruction() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
                Under Construction
            </h1>
            <Image
                width={500}
                height={500}
                src="/constraction.png"
                alt="Under Construction"
                className="max-w-full h-auto w-4/5 md:w-1/2 lg:w-1/3"
            />
        </div>
    );
}

export { UnderConstruction };
