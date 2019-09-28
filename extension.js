
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

let text, button;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _onWorkspaceSwitched() {
    // TODO: Actually use...
    this._currentWorkspace = global.workspace_manager.get_active_workspace_index();

    this._updateMenuOrnament();
    this._updateActiveThumbnail();

    this._statusLabel.set_text(this._labelText());
}

function _showHello() {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world!" });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

class Extension {
    constructor() {
        this.button = new St.Bin({ style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: true,
        track_hover: true });
        let label = new St.Label({ text: '  w  ', style_class: 'workspace-indicator' });

        this.button.set_child(label);
        this.button.connect('button-press-event', _showHello);
    }

    enable() {
        Main.panel._rightBox.insert_child_at_index(this.button, 0);
    }

    disable() {
        Main.panel._rightBox.remove_child(this.button);
    }
}

function init() {
    return new Extension();
}