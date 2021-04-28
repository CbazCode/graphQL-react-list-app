import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries';

const AddBook = () => {
	const [book, setBook] = useState({ name: '', genre: '', authorId: '' });
	const { loading, data } = useQuery(getAuthorsQuery);
	const [addBook] = useMutation(addBookMutation);

	//  console.log(data?.authors)
	const displayAuthors = () => {
		if (loading) {
			return <option disabled>Loading Authors...</option>;
		} else {
			return data.authors.map((author) => (
				<option key={author.id} value={author.id}>
					{author.name}
				</option>
			));
		}
	};
	const handleChange = (e) => {
		setBook({ ...book, [e.target.name]: e.target.value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();

		addBook({
			variables: {
				name: book.name,
				genre: book.genre,
				authorId: book.authorId,
			},
			refetchQueries: [{ query: getBooksQuery }],
		});
		setBook({ name: '', genre: '', authorId: '' });
	};
	return (
		<form id="add-book" onSubmit={handleSubmit}>
			<div className="field">
				<label>Book name:</label>
				<input required type="text" name="name" value={book.name} onChange={handleChange} />
			</div>
			<div className="field">
				<label>Genre:</label>
				<input required type="text" name="genre" value={book.genre} onChange={handleChange} />
			</div>
			<div className="field">
				<label>Author:</label>
				<select required name="authorId" value={book.authorId} onChange={handleChange}>
					<option>Select author</option>
					{displayAuthors()}
				</select>
			</div>
			<button type="submit">+</button>
		</form>
	);
};

export default AddBook;