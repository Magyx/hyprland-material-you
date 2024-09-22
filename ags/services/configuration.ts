// by koeqaife ;)

const { GLib } = imports.gi;

type ConfigType = {
    always_show_battery: boolean;
    show_taskbar: boolean;
    show_battery_percent: boolean;
    weather: string;
    weather_location_id: string;
    current_theme: string | null
}

export const default_config: ConfigType = {
    always_show_battery: false,
    show_taskbar: true,
    show_battery_percent: true,
    weather: "",
    weather_location_id: "",
    current_theme: null
};

Utils.exec(["mkdir", "-p", `${GLib.get_home_dir()}/.config/ags_config/`]);
const config_file = `${GLib.get_home_dir()}/.config/ags_config/conf.json`;
if (Utils.readFile(config_file).length < 2) {
    Utils.writeFileSync(JSON.stringify(default_config), config_file);
}

class ConfigService extends Service {
    static {
        Service.register(
            this,
            {
                "config-changed": ["jsobject"]
            },
            {
                config: ["jsobject", "rw"]
            }
        );
    }

    #config = default_config;
    #config_file = config_file;

    get config() {
        return this.#config;
    }

    set config(conf) {
        Utils.writeFile(JSON.stringify(conf), this.#config_file).catch(print);
    }

    set_value(key: keyof typeof default_config, value: string) {
        this.config = {...this.config, [key]: value}
    }

    constructor() {
        super();

        const config_file = this.#config_file;
        Utils.monitorFile(config_file, () => this.#onChange());

        this.#onChange();
    }

    #onChange() {
        Utils.readFileAsync(this.#config_file).then((out) => {
            this.#config = { ...default_config, ...JSON.parse(out) };
            this.emit("changed");
            this.notify("config");

            this.emit("config-changed", this.#config);
        });
    }

    connect(event = "config-changed", callback) {
        return super.connect(event, callback);
    }
}

const service = new ConfigService();

export default service;
