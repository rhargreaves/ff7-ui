
var React = require('react');
var ReactDOM = require('react-dom');

var FF7Window = React.createClass({
	render: function() {
		return (
		<div class="ff7-window">
			<h1>{this.props.name}</h1>
			<p>{this.props.text}</p>
		</div>
		);
	}
});

ReactDOM.render(
		<FF7Window name="Aeris" text="Blah Blah" />,
		document.getElementById('example')
		);
