
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

let text, button;

class Extension {
    constructor() {
        this._button = new St.Bin({ style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            x_fill: true,
            y_fill: true,
            track_hover: true
        });
        this._label = new St.Label({ text: '  w  ', style_class: 'workspace-indicator-1' });
        this._button.set_child(this._label);
    }

    _onWorkspaceSwitched() {
        let workspaceIndex = global.workspace_manager.get_active_workspace_index();
        this._label.set_text("   " + (workspaceIndex + 1) + "   ");
        this._label.style_class = 'workspace-indicator-' + (workspaceIndex % 5 + 1);
        Main.panel.style_class = 'upper-glow-' + (workspaceIndex % 5 + 1);
    }

    enable() {
        Main.panel._rightBox.insert_child_at_index(this._button, 0);
        Main.panel.style_class = 'upper-glow-1';

        this._workspaceSwitchedSignal = 
            global.workspace_manager.connect_after('workspace-switched',
                this._onWorkspaceSwitched.bind(this));
    }

    disable() {
        Main.panel._rightBox.remove_child(this._button);
        Main.panel.style_class = null;
        global.workspace_manager.disconnect(this._workspaceSwitchedSignal);
    }
}

function init() {
    return new Extension();
}