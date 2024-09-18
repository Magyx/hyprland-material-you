import Widget from "resource:///com/github/Aylur/ags/widget.js";
const Lang = imports.lang;
import Gtk from "gi://Gtk?version=3.0";

export const GetHyprOptions = () => {
    const hyprRounding = Number(JSON.parse(Utils.exec("hyprctl getoption decoration:rounding -j")).int);
    const hyprOuterGap = Number(String(JSON.parse(Utils.exec("hyprctl getoption general:gaps_out -j")).custom).split(' ')[0]);
    return hyprRounding + hyprOuterGap;
};


export const RoundedCorner = (place, props) =>
    Widget.DrawingArea({
        ...props,
        hpack: place.includes("left") ? "start" : "end",
        vpack: place.includes("top") ? "start" : "end",
        setup: (widget) =>
            Utils.timeout(1, () => {
                const r = GetHyprOptions();
                widget.set_size_request(r, r);
                widget.connect(
                    "draw",
                    // @ts-ignore
                    Lang.bind(widget, (widget, cr) => {
                        const c = widget.get_style_context().get_property("background-color", Gtk.StateFlags.NORMAL);
                        // const borderColor = widget.get_style_context().get_property('color', Gtk.StateFlags.NORMAL);
                        // const borderWidth = widget.get_style_context().get_border(Gtk.StateFlags.NORMAL).left; // ur going to write border-width: something anyway        
                        widget.set_size_request(r, r);

                        switch (place) {
                            case "top_left":
                                cr.arc(r, r, r, Math.PI, (3 * Math.PI) / 2);
                                cr.lineTo(0, 0);
                                break;

                            case "top_right":
                                cr.arc(0, r, r, (3 * Math.PI) / 2, 2 * Math.PI);
                                cr.lineTo(r, 0);
                                break;

                            case "bottom_left":
                                cr.arc(r, 0, r, Math.PI / 2, Math.PI);
                                cr.lineTo(0, r);
                                break;

                            case "bottom_right":
                                cr.arc(0, 0, r, 0, Math.PI / 2);
                                cr.lineTo(r, r);
                                break;
                        }

                        cr.closePath();
                        cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
                        cr.fill();
                        // cr.setLineWidth(borderWidth);
                        // cr.setSourceRGBA(borderColor.red, borderColor.green, borderColor.blue, borderColor.alpha);
                        // cr.stroke();
                    })
                );
            })
    });
