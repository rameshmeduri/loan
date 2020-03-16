var ITEM_WIDTH = 35;
class WindowResize extends React.Component {
	constructor (props) {
		super();
		this._handleWindowResize = _.debounce(this._handleWindowResize.bind(this), 100);
		this.state = {
			containerWidth: 0
		};
		this._isMounted = false;
	}

	componentDidMount () {
		this._isMounted = true;
		window.addEventListener('resize', this._handleWindowResize);
	}

	componentDidUnmount () {
		this._isMounted = false;
		window.removeEventListener('resize', this._handleWindowResize);
	}

	_handleWindowResize () {
		if (this._isMounted) {
			this.setState({
				containerWidth: React.findDOMNode(this._containerTarget).offsetWidth
			});
		}
	}

	_truncateItems (items) {
		var containerWidth = this.state.containerWidth;
		var maxItemsToShow = Math.floor(containerWidth / ITEM_WIDTH);

		if (items.length <= maxItemsToShow || maxItemsToShow < 1) {
			return items;
		}

		// The item displaying the number of remaining items has to also count itself so its +1
		var numberOfCountingItems = 1;
		var numberOfRemainingItems = items.length - maxItemsToShow + numberOfCountingItems;
		var truncatedItems = items.slice(0, maxItemsToShow - numberOfCountingItems);
		var displayNumberHtml = (
			<div className='-additionalItemsCounter' key='additionalItemsCounter'>
			<span>+{numberOfRemainingItems}</span>
		</div>
		);

		truncatedItems.push(displayNumberHtml);
		return truncatedItems;
	}

	render() {
		var items = _.range(1, 61).map(index => {
			return (
				<div className='-item' key={index}>
					{index}
				</div>
			);
		})
		return (
			<div>
				<p>{items.length} items in the container below</p>
				<p>You can drag the width of this quadrant and see the container resize!</p>
				<div 
					className='-items'
					ref={node => {
						// this callback executes before componentDidMount
						if (node !== null) {
							this._containerTarget = node;
							if (!this._isMounted) {
								this._isMounted = true;
								this._handleWindowResize();
							}
						}
					}}
				 >
					{this._truncateItems(items)}
				</div>
			</div>
		);
	}
}

React.render(<WindowResize />, document.body);
