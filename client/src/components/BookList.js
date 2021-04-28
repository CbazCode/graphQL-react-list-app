import React, { useState } from 'react';

import { useQuery } from '@apollo/client';
import { getBooksQuery } from '../queries/queries';

import BookDetails from './BookDetails';

const BookList = () => {
	const [selected, setSelected] = useState(null);
	const { loading, error, data } = useQuery(getBooksQuery);
	//console.log(data)
	if (loading) return <div>Loading Books</div>;
	if (error) return <div>An error has occurred</div>;
	return (
		<div>
			<ul id="book-list">
				{data.books.map((book) => (
					<li key={book.id} onClick={(e) => setSelected(book.id)}>
						{book.name}
					</li>
				))}
			</ul>
			<BookDetails bookId={selected} />
		</div>
	);
};

export default BookList;