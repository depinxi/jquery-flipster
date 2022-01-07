const {
	EventEmitter
} =  require ('events');

module.exports = class extends EventEmitter {
	/**
	 * @param selector DOM selector or jQuery object
	 * @param Flipster options
	 */
	constructor (selector, options) {
		super ();
		this.jQuery = null;
		if (typeof(jQuery) != 'undefined') {
			this.jQuery = jQuery;
		} else {
			this.jQuery = require ('jquery');
		}
		if (typeof (this.jQuery.fn.flipster) != 'function') {
			const Plugin = require ('./jquery.flipster.js');
			Plugin (this.jQuery, window);
		}
		
		this.node = this.jQuery (selector);
		if (!(typeof(options) == 'object'&& options)) {
			options = {};
		}
		
		this.onItemSwitch = options.onItemSwitch;
		options.onItemSwitch = this.handleSwitchEvent.bind(this);
		
		this.currentItem = null;
		
		this.flipster = this.node.flipster(options);
	}
	
	goToNext() {
		this.node.flipster ('next');
	}
	
	goToPrevious() {
		this.node.flipster ('previous');
	}
	
	goTo(index) {
		this.node.flipster ('jump', index);
	}
	
	play () {
		this.node.flipster ('play');
	}
	
	pause () {
		this.node.flipster ('pause');
	}
	
	stop () {
		this.node.flipster ('stop');
	}
	
	invalidate () {
		this.node.flipster ('index');
	}
	
	handleSwitchEvent (e) {
		if (typeof(this.onItemSwitch) == 'function') {
			this.onItemSwitch.apply (this.node, [e]);
		}
		
		const previous = this.currentItem;
		this.currentItem = e;
		
		this.emit('change', {
			'previous': previous,
			'current': this.currentItem
		});
	}
};