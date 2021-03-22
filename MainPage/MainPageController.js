({
	addStyleMinus: function (component, event) {
		var rowsMinus = event.getParam('minus');
		rowsMinus.forEach(row => {
			var customElement = component.find("grid-component").getElement();
			var lightningTreeGridElement = customElement.shadowRoot.querySelector('lightning-tree-grid');
			var datatableElement = lightningTreeGridElement.shadowRoot.querySelector('lightning-datatable');
			var attribute = 'tr[data-row-key-value="' + row + '"]';
			var neededTrElement = datatableElement.shadowRoot.querySelector(attribute)
			var className = neededTrElement.className;
			if (!className.includes(' minus')) {
				neededTrElement.className = className + ' minus';
			}
		})
	},

	deleteParentMinus: function (component, event) {
		var parentLabel = event.getParam('parent');
		var customElement = component.find("grid-component").getElement();
		var lightningTreeGridElement = customElement.shadowRoot.querySelector('lightning-tree-grid');
		var datatableElement = lightningTreeGridElement.shadowRoot.querySelector('lightning-datatable');
		var attribute = 'tr[data-row-key-value="' + parentLabel + '"]';
		var neededTrElement = datatableElement.shadowRoot.querySelector(attribute)
		var className = neededTrElement.className;
		var beforeClass = className.replace(' minus', '');
		neededTrElement.className = beforeClass;
	},
});
