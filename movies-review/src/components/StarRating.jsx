import React, { useEffect, useState } from 'react'
import { FaStar, FaRegStar } from "react-icons/fa";

export default function StarRating({ id }) {
    const [Rating, setRating] = useState(() => {
        const savedRatings = JSON.parse(localStorage.getItem("rating")) || {};
        return savedRatings[id] || 0;
    });
    const [Hover, setHover] = useState(null);

    useEffect(() => {
        const savedRatings = JSON.parse(localStorage.getItem("rating")) || {};
        savedRatings[id] = Rating;
        localStorage.setItem("rating", JSON.stringify(savedRatings));
    }, [Rating, id]);

    return (
        <div className='flex'>
            {Array(5).fill(0).map((_, index) => {
                const value = index + 1;
                return (
                    <span
                        key={index}
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(null)}
                        className="cursor-pointer text-2xl"
                    >
                        {value <= (Hover ?? Rating) ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-400" />}
                    </span>
                )
            })}
        </div>
    )
}
