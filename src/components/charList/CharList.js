import PropTypes from 'prop-types';
import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 210,
		charEnded: false,
		total: 0,
		charId: null,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest();
	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService
			.getAllCharacters(offset)
			.then((data) => {
				this.onCharListLoaded(data.total, data.transformedCharacter);
			})
			.catch(this.onError);
	};

	onCharListLoading = () => {
		this.setState({ newItemLoading: true });
	};

	onCharListLoaded = (totalChar, newCharList) => {
		let ended = false;
		let total = totalChar;

		if (this.state.offset >= total - 9) {
			ended = true;
		}

		this.setState(({ offset, charList }) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended,
			total: total,
		}));
	};

	onError = () => {
		this.setState({
			error: true,
			loading: false,
		});
	};

	setCharId = (id) => {
		this.setState({
			charId: id,
		});
	};

	renderItems(arr) {
		const items = arr.map((item) => {
			let imgStyle = { objectFit: 'cover' };
			if (
				item.thumbnail ===
				'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
			) {
				imgStyle = { objectFit: 'unset' };
			}

			return (
				<li
					tabindex='0'
					className='char__item'
					key={item.id}
					style={{
						boxShadow:
							this.state.charId === item.id ? '0 5px 20px red' : 'none',
						transform:
							this.state.charId === item.id ? 'translateY(-8px)' : 'none',
					}}
					onClick={() => {
						this.props.onCharSelected(item.id);
						this.setCharId(item.id);
					}}
					onFocus={() => {
						this.props.onCharSelected(item.id);
						this.setCharId(item.id);
					}}
				>
					<img src={item.thumbnail} alt={item.name} style={imgStyle} />
					<div className='char__name'>{item.name}</div>
				</li>
			);
		});

		return <ul className='char__grid'>{items}</ul>;
	}

	render() {
		const { charList, loading, error, newItemLoading, offset, charEnded } =
			this.state;

		const items = this.renderItems(charList);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className='char__list'>
				{errorMessage}
				{spinner}
				{content}
				<button
					className='button button__main button__long'
					disabled={newItemLoading}
					style={{ display: charEnded ? 'none' : 'block' }}
					onClick={() => this.onRequest(offset)}
				>
					<div className='inner'>load more</div>
				</button>
			</div>
		);
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};
export default CharList;
