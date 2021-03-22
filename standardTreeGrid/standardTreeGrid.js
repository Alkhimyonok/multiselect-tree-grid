import { LightningElement } from 'lwc';
import {
	EXAMPLES_COLUMNS_DEFINITION,
	EXAMPLES_DATA,
} from './data';

export default class StandardTreeGrid extends LightningElement {
	selectedRows = [];
	toggledRows = [];
	minusRows = [];

	gridColumns = EXAMPLES_COLUMNS_DEFINITION;
	gridData = EXAMPLES_DATA;

	handleToggle(event) {
		var currentToggledParent = event.detail.name;
		if (event.detail.isExpanded === false) {
			this.toggledRows.push(currentToggledParent);
		} else {
			const indexToggledParent = this.toggledRows.indexOf(currentToggledParent);
			if (indexToggledParent > -1) {
				this.toggledRows.splice(indexToggledParent, 1);
			}
			if (this.selectedRows.length > 0) {
				this.selectedRows = this.selectedRows.slice();
			}
		}
	}

	handleRowSelection() {
		var tempList = [];
		var selectRows = this.template.querySelector('lightning-tree-grid').getSelectedRows();
		this.keepExpandedSelection(tempList);
		if (selectRows.length > 0) {
			selectRows.forEach(row => {
				tempList.push(row.label);
			})
			this.gridData.forEach(row => {
				// if parent was checked - add parent and children/delete parent and children
				if (!this.selectedRows.includes(row.label) && tempList.includes(row.label)) {
					if (row.hasOwnProperty('_children')) {
						//if click to minus Parent - delete parent and children
						if (this.minusRows.includes(row.label)) {
							const indexParentTemp = tempList.indexOf(row.label);
							tempList.splice(indexParentTemp, 1);
							this.deleteMinusStyle(row.label);
							row._children.forEach(child => {
								if (this.selectedRows.includes(child.label)) {
									const indexChildTemp = tempList.indexOf(child.label);
									tempList.splice(indexChildTemp, 1);
									const indexChild = this.selectedRows.indexOf(child.label);
									this.selectedRows.splice(indexChild, 1);
								}
							})
						}
						//if checked parent empty checkbox - add parent and children
						else {
							row._children.forEach(child => {
								if (!tempList.includes(child.label)) {
									tempList.push(child.label);
								}
							})
						}
					}
				}
				// if parent was unchecked - delete parent and all children
				if (this.selectedRows.includes(row.label) && !tempList.includes(row.label)) {
					if (row.hasOwnProperty('_children')) {
						row._children.forEach(item => {
							const index = tempList.indexOf(item.label);
							if (index > -1) {
								tempList.splice(index, 1);
							}
						})
					}
				}
				// if child was checked
				// if all children for specific parent are checked - checked the parent
				// else remove the header
				var allSelected = true;
				var countSelected = 0;
				if (row.hasOwnProperty('_children')) {
					row._children.forEach(child => {
						if (!tempList.includes(child.label)) {
							allSelected = false;
						} else {
							countSelected++;
						}
					})
					//if last child is selected
					if (allSelected && !tempList.includes(row.label)) {
						tempList.push(row.label);
						this.deleteMinusStyle(row.label);
					} else

						// if child was unchecked
						if (!allSelected && tempList.includes(row.label)) {
							const index = tempList.indexOf(row.label);
							if (index > -1) {
								tempList.splice(index, 1);
							}
						}

					// add minus if needed
					if (!allSelected && countSelected > 0) {
						const index = this.minusRows.indexOf(row.label);
						if (index == -1) {
							this.minusRows.push(row.label);
						}
					}
				}
			})
		}
		this.addMinusStyle();
		this.selectedRows = tempList.slice();
		this.checkLastChildUnselection();
		console.log('selectedRows=' + this.selectedRows);
	}

	keepExpandedSelection(tempList) {
		this.toggledRows.forEach(row => {
			this.gridData.forEach(rowData => {
				if (rowData.label === row) {
					rowData._children.forEach(child => {
						this.selectedRows.forEach(item => {
							if (item === child.label) {
								tempList.push(item);
							}
						})
					})
				}
			})
		})
	}

	addMinusStyle() {
		var objMinus = {
			minus: this.minusRows
		};
		const evtSelectParent = new CustomEvent('addminusevent', { detail: objMinus });
		this.dispatchEvent(evtSelectParent);
	}

	deleteMinusStyle(row) {
		const indexParentMinus = this.minusRows.indexOf(row);
		if (indexParentMinus > -1) {
			this.minusRows.splice(indexParentMinus, 1);
		}
		var evtDetail = {
			parent: row
		};
		const evtDeleteMinus = new CustomEvent('deleteminusevent', { detail: evtDetail });
		this.dispatchEvent(evtDeleteMinus);
	}

	// if was unchecked last child
	checkLastChildUnselection() {
		this.gridData.forEach(row => {
			var allSelected = true;
			var countSelected = 0;
			if (row.hasOwnProperty('_children')) {
				row._children.forEach(item => {
					if (!this.selectedRows.includes(item.label)) {
						allSelected = false;
					} else {
						countSelected++;
					}
				})
				if (!allSelected && countSelected == 0 && this.minusRows.includes(row.label)) {
					this.deleteMinusStyle(row.label);
				}
			}
		})
	}
}
