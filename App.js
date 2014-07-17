Ext.define('CustomApp',
{
    extend: 'Rally.app.App',
    componentCls: 'app',

	// -------------------
    // Entry Point to App
	// -------------------
    launch: function()
	{
		this.pulldownContainer = Ext.create("Ext.container.Container",
		{
			layout:
			{
				type: "hbox",
				align: "stretch"
			},
		});
		this.add(this.pulldownContainer);
		this._loadIterations();
    },
	
	// --------------------------------------
	// Populate the Iteration drop down box
	// --------------------------------------
	_loadIterations: function()
	{
		this.iterComboBox = Ext.create("Rally.ui.combobox.IterationComboBox",
		{
			fieldLabel: "Iteration",
			labelAlign: "right",
			width: 300,
			listeners:
			{
				ready: function(combobox)
				{
					this._loadOwners();
				},
				select: function(combobox, records)
				{
					this._loadData();	
				},
				scope: this
			}
		});
		this.pulldownContainer.add(this.iterComboBox);
	},
	
	// ---------------------------------
	// Populate the Owner drop down box
	// ---------------------------------
	_loadOwners: function()
	{
		this.ownerComboBox = Ext.create("Rally.ui.combobox.UserSearchComboBox",
		{
			project: "/project/17290060397",
			fieldLabel: "Owner",
			labelAlign: "right",
			width: 300,
			listeners:
			{
				ready: function(combobox)
				{
					this._loadData();
				},
				select: function(combobox, records)
				{
					this._loadData();	
				},
				scope: this
			}
		});
		this.pulldownContainer.add(this.ownerComboBox);
	},

	// ---------------------------
    // Load task data from Rally
	// ---------------------------
    _loadData: function()
	{
		var selectedIterRef = this.iterComboBox.getRecord().get("_ref");
		var selectedOwner = this.ownerComboBox.getRecord().get("_ref");
		var myFilters =
		[
			{
				property: "Iteration",
				operation: "=",
				value: selectedIterRef
			},
			{
				property: "Owner",
				operation: "=",
				value: selectedOwner
			},
		];
			
		if (this.taskStore)
		{
			this.taskStore.setFilter(myFilters);
			this.taskStore.load();
		}
		else
		{
			this.taskStore = Ext.create('Rally.data.wsapi.Store',
			{
				model: 'Task',
				autoLoad: true,
				filters: myFilters,
				listeners:
				{
					load: function(myStore, myData, success)
					{
						if(!this.myGrid)
						{
							this._createGrid(myStore);
						}
					},
					scope: this
				},
				fetch: ["WorkProduct", "Name", "State", "Estimate", "ToDo", "Blocked"]
			});
		}
    },

	// ----------------------------------------------
    // Create the grid and populate with Rally data
	// ----------------------------------------------
    _createGrid: function(myTaskStore)
	{
      this.myGrid = Ext.create('Rally.ui.grid.Grid',
	  {
        store: myTaskStore,
		columnLines: false,
		rowLines: false,
		title: "Your Tasks by Sprint",
		width: 800,
        columnCfgs: ["WorkProduct", "Name", "State", "Estimate", "ToDo", "Blocked"]
      });
      this.add(this.myGrid);
    }

});
