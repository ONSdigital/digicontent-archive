
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var data = {
       "Mar 2003": {
          "Robbery": "110,271",
          "Knife and sharp instruments": null,
          "Homicide": "1,047"
       },
       "Mar 2004": {
          "Robbery": "103,736",
          "Knife and sharp instruments": null,
          "Homicide": "904"
       },
       "Mar 2005": {
          "Robbery": "91,010",
          "Knife and sharp instruments": null,
          "Homicide": "868"
       },
       "Mar 2006": {
          "Robbery": "98,198",
          "Knife and sharp instruments": null,
          "Homicide": "764"
       },
       "Mar 2007": {
          "Robbery": "101,376",
          "Knife and sharp instruments": null,
          "Homicide": "758"
       },
       "Mar 2008": {
          "Robbery": "84,773",
          "Knife and sharp instruments": null,
          "Homicide": "775"
       },
       "Mar 2009": {
          "Robbery": "80,130",
          "Knife and sharp instruments": null,
          "Homicide": "664"
       },
       "Mar 2010": {
          "Robbery": "75,105",
          "Knife and sharp instruments": null,
          "Homicide": "620"
       },
       "Mar 2011": {
          "Robbery": "76,189",
          "Knife and sharp instruments": "34,020",
          "Homicide": "639"
       },
       "Mar 2012": {
          "Robbery": "74,688",
          "Knife and sharp instruments": "32,004",
          "Homicide": "553"
       },
       "Mar 2013": {
          "Robbery": "65,155",
          "Knife and sharp instruments": "27,303",
          "Homicide": "558"
       },
       "Mar 2014": {
          "Robbery": "57,828",
          "Knife and sharp instruments": "26,694",
          "Homicide": "533"
       },
       "Mar 2015": {
          "Robbery": "50,154",
          "Knife and sharp instruments": "27,401",
          "Homicide": "539"
       },
       "Mar 2016": {
          "Robbery": "51,234",
          "Knife and sharp instruments": "30,927",
          "Homicide": "578"
       },
       "Mar 2017": {
          "Robbery": "59,417",
          "Knife and sharp instruments": "37,811",
          "Homicide": "709"
       },
       "Mar 2018": {
          "Robbery": "77,247",
          "Knife and sharp instruments": "45,515",
          "Homicide": "711"
       },
       "Mar 2019": {
          "Robbery": "85,936",
          "Knife and sharp instruments": "49,342",
          "Homicide": "673"
       },
       "Mar 2020": {
          "Robbery": "90,197",
          "Knife and sharp instruments": "51,982",
          "Homicide": "717"
       },
       "Mar 2021": {
          "Robbery": "59,646",
          "Knife and sharp instruments": "41,671",
          "Homicide": "571"
       },
       "Dec 2022": {
          "Robbery": "71,983",
          "Knife and sharp instruments": "46,153",
          "Homicide": "616"
       },
       "Dec 2023": {
          "Robbery": "81,094",
          "Knife and sharp instruments": "49,489",
          "Homicide": "577"
       }
    };

    /* src\App.svelte generated by Svelte v3.58.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (140:8) {:else}
    function create_else_block(ctx) {
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			t0 = text("N/A\n          ");
    			span = element("span");
    			span.textContent = "▼";
    			set_style(span, "width", "10px");
    			set_style(span, "color", "white");
    			set_style(span, "text-align", "center");
    			add_location(span, file, 141, 10, 3751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(140:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (125:8) {#if Math.abs((data[latestYear][crime].replace(/,/g,'')  - data[previousYear][crime].replace(/,/g,'') ) / data[previousYear][crime].replace(/,/g,'') ) < 1}
    function create_if_block_6(ctx) {
    	let t0_value = ((data[/*latestYear*/ ctx[2]][/*crime*/ ctx[12]].replace(/,/g, '') - data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '')) / data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '') * 100).toFixed(0) + "";
    	let t0;
    	let t1;
    	let show_if_1 = (data[/*latestYear*/ ctx[2]][/*crime*/ ctx[12]].replace(/,/g, '') - data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '')) / data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '') < 0;
    	let t2;
    	let show_if = (+data[/*latestYear*/ ctx[2]][/*crime*/ ctx[12]].replace(/,/g, '') - data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '')) / +data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '') > 0;
    	let if_block1_anchor;
    	let if_block0 = show_if_1 && create_if_block_8(ctx);
    	let if_block1 = show_if && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text("%\n          ");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(125:8) {#if Math.abs((data[latestYear][crime].replace(/,/g,'')  - data[previousYear][crime].replace(/,/g,'') ) / data[previousYear][crime].replace(/,/g,'') ) < 1}",
    		ctx
    	});

    	return block;
    }

    // (127:10) {#if ((data[latestYear][crime].replace(/,/g,'')  - data[previousYear][crime].replace(/,/g,'') ) / data[previousYear][crime].replace(/,/g,'') )<0}
    function create_if_block_8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "▼";
    			set_style(span, "width", "10px");
    			set_style(span, "color", "#206095");
    			set_style(span, "text-align", "center");
    			add_location(span, file, 127, 10, 3276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(127:10) {#if ((data[latestYear][crime].replace(/,/g,'')  - data[previousYear][crime].replace(/,/g,'') ) / data[previousYear][crime].replace(/,/g,'') )<0}",
    		ctx
    	});

    	return block;
    }

    // (133:10) {#if ((+data[latestYear][crime].replace(/,/g,'')  - data[previousYear][crime].replace(/,/g,'') ) / +data[previousYear][crime].replace(/,/g,'') )>0}
    function create_if_block_7(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "▲";
    			set_style(span, "width", "10px");
    			set_style(span, "color", "#F66068");
    			set_style(span, "text-align", "center");
    			add_location(span, file, 133, 10, 3576);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(133:10) {#if ((+data[latestYear][crime].replace(/,/g,'')  - data[previousYear][crime].replace(/,/g,'') ) / +data[previousYear][crime].replace(/,/g,'') )>0}",
    		ctx
    	});

    	return block;
    }

    // (150:12) {#if v <= 0 || rows[i][ii + 1] < 0}
    function create_if_block_5(ctx) {
    	let rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", /*ii*/ ctx[17] * /*yearLength*/ ctx[6] - 1);
    			attr_dev(rect, "y", "-2");
    			attr_dev(rect, "width", /*yearLength*/ ctx[6]);
    			attr_dev(rect, "height", /*sparkHeight*/ ctx[4] + 4);
    			attr_dev(rect, "fill", "lightgrey");
    			attr_dev(rect, "opacity", "0.4");
    			add_location(rect, file, 150, 14, 4077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(150:12) {#if v <= 0 || rows[i][ii + 1] < 0}",
    		ctx
    	});

    	return block;
    }

    // (160:12) {#if !["CSEW crime","Fraud","Computer misuse","Knife and sharp instruments"].includes(crime) && ii==0}
    function create_if_block_4(ctx) {
    	let text_1;
    	let t_value = /*start*/ ctx[3][/*crime*/ ctx[12]] + "";
    	let t;
    	let line;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			line = svg_element("line");
    			attr_dev(text_1, "x", /*ii*/ ctx[17] * /*yearLength*/ ctx[6] - 20);
    			attr_dev(text_1, "y", /*sparkHeight*/ ctx[4] + 12);
    			attr_dev(text_1, "font-size", "10px");
    			attr_dev(text_1, "fill", "#666");
    			add_location(text_1, file, 160, 12, 4434);
    			attr_dev(line, "x1", /*ii*/ ctx[17] * /*yearLength*/ ctx[6] + 3);
    			attr_dev(line, "x2", 20 * /*yearLength*/ ctx[6]);
    			attr_dev(line, "y1", /*sparkHeight*/ ctx[4] + 8);
    			attr_dev(line, "y2", /*sparkHeight*/ ctx[4] + 8);
    			attr_dev(line, "stroke", "lightgrey");
    			add_location(line, file, 167, 10, 4630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    			insert_dev(target, line, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(160:12) {#if ![\\\"CSEW crime\\\",\\\"Fraud\\\",\\\"Computer misuse\\\",\\\"Knife and sharp instruments\\\"].includes(crime) && ii==0}",
    		ctx
    	});

    	return block;
    }

    // (172:12) {#if ( ii==20)}
    function create_if_block_3(ctx) {
    	let text_1;
    	let t;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text("2023\n          ");
    			attr_dev(text_1, "x", /*ii*/ ctx[17] * /*yearLength*/ ctx[6] + 3);
    			attr_dev(text_1, "y", /*sparkHeight*/ ctx[4] + 12);
    			attr_dev(text_1, "font-size", "10px");
    			attr_dev(text_1, "fill", "#666");
    			add_location(text_1, file, 172, 12, 4801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(172:12) {#if ( ii==20)}",
    		ctx
    	});

    	return block;
    }

    // (182:12) {#if (rows[i][ii + 1] < 0) && (rows[i][ii + 2] > 0) && ii<14}
    function create_if_block_2(ctx) {
    	let text_1;
    	let t_value = /*start*/ ctx[3][/*crime*/ ctx[12]] + "";
    	let t;
    	let line;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			line = svg_element("line");
    			attr_dev(text_1, "x", /*ii*/ ctx[17] * /*yearLength*/ ctx[6] - 14);
    			attr_dev(text_1, "y", /*sparkHeight*/ ctx[4] + 12);
    			attr_dev(text_1, "font-size", "10px");
    			attr_dev(text_1, "fill", "#666");
    			add_location(text_1, file, 182, 14, 5084);
    			attr_dev(line, "x1", /*ii*/ ctx[17] * 5.3 + 12);
    			attr_dev(line, "x2", 20 * /*yearLength*/ ctx[6]);
    			attr_dev(line, "y1", /*sparkHeight*/ ctx[4] + 8);
    			attr_dev(line, "y2", /*sparkHeight*/ ctx[4] + 8);
    			attr_dev(line, "stroke", "lightgrey");
    			add_location(line, file, 189, 12, 5294);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    			insert_dev(target, line, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(182:12) {#if (rows[i][ii + 1] < 0) && (rows[i][ii + 2] > 0) && ii<14}",
    		ctx
    	});

    	return block;
    }

    // (193:12) {#if rows[i][ii] > -1 && rows[i][ii + 1] > -1 && ii < rows[i].length - 1}
    function create_if_block_1(ctx) {
    	let line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", /*ii*/ ctx[17] * /*yearLength*/ ctx[6]);
    			attr_dev(line, "x2", /*ii*/ ctx[17] * /*yearLength*/ ctx[6] + /*yearLength*/ ctx[6]);
    			attr_dev(line, "y1", (1 - /*v*/ ctx[15]) * /*sparkHeight*/ ctx[4]);
    			attr_dev(line, "y2", (1 - /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 1]) * /*sparkHeight*/ ctx[4]);
    			attr_dev(line, "stroke", "#206095");
    			attr_dev(line, "stroke-width", "3px");
    			attr_dev(line, "stroke-linecap", "round");
    			add_location(line, file, 193, 14, 5518);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(193:12) {#if rows[i][ii] > -1 && rows[i][ii + 1] > -1 && ii < rows[i].length - 1}",
    		ctx
    	});

    	return block;
    }

    // (204:12) {#if ii == rows[i].length - 1}
    function create_if_block(ctx) {
    	let circle;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", /*ii*/ ctx[17] * /*yearLength*/ ctx[6]);
    			attr_dev(circle, "cy", (1 - /*v*/ ctx[15]) * /*sparkHeight*/ ctx[4]);
    			attr_dev(circle, "r", "2");
    			attr_dev(circle, "fill", "#206095");
    			add_location(circle, file, 204, 14, 5897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(204:12) {#if ii == rows[i].length - 1}",
    		ctx
    	});

    	return block;
    }

    // (149:10) {#each rows[i] as v, ii}
    function create_each_block_1(ctx) {
    	let if_block0_anchor;
    	let show_if = !["CSEW crime", "Fraud", "Computer misuse", "Knife and sharp instruments"].includes(/*crime*/ ctx[12]) && /*ii*/ ctx[17] == 0;
    	let if_block1_anchor;
    	let if_block2_anchor;
    	let if_block3_anchor;
    	let if_block4_anchor;
    	let if_block5_anchor;
    	let if_block0 = (/*v*/ ctx[15] <= 0 || /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 1] < 0) && create_if_block_5(ctx);
    	let if_block1 = show_if && create_if_block_4(ctx);
    	let if_block2 = /*ii*/ ctx[17] == 20 && create_if_block_3(ctx);
    	let if_block3 = /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 1] < 0 && /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 2] > 0 && /*ii*/ ctx[17] < 14 && create_if_block_2(ctx);
    	let if_block4 = /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17]] > -1 && /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 1] > -1 && /*ii*/ ctx[17] < /*rows*/ ctx[5][/*i*/ ctx[14]].length - 1 && create_if_block_1(ctx);
    	let if_block5 = /*ii*/ ctx[17] == /*rows*/ ctx[5][/*i*/ ctx[14]].length - 1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			if (if_block4) if_block4.c();
    			if_block4_anchor = empty();
    			if (if_block5) if_block5.c();
    			if_block5_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, if_block0_anchor, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, if_block4_anchor, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, if_block5_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*v*/ ctx[15] <= 0 || /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 1] < 0) if_block0.p(ctx, dirty);
    			if (show_if) if_block1.p(ctx, dirty);
    			if (/*ii*/ ctx[17] == 20) if_block2.p(ctx, dirty);
    			if (/*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 1] < 0 && /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 2] > 0 && /*ii*/ ctx[17] < 14) if_block3.p(ctx, dirty);
    			if (/*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17]] > -1 && /*rows*/ ctx[5][/*i*/ ctx[14]][/*ii*/ ctx[17] + 1] > -1 && /*ii*/ ctx[17] < /*rows*/ ctx[5][/*i*/ ctx[14]].length - 1) if_block4.p(ctx, dirty);
    			if (/*ii*/ ctx[17] == /*rows*/ ctx[5][/*i*/ ctx[14]].length - 1) if_block5.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(if_block0_anchor);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(if_block4_anchor);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(if_block5_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(149:10) {#each rows[i] as v, ii}",
    		ctx
    	});

    	return block;
    }

    // (112:2) {#each crimes as crime, i}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*crime*/ ctx[12] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = (+data[/*latestYear*/ ctx[2]][/*crime*/ ctx[12]].replace(/,/g, '')).toLocaleString() + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4;
    	let td3;
    	let svg;

    	function select_block_type(ctx, dirty) {
    		if (Math.abs((data[/*latestYear*/ ctx[2]][/*crime*/ ctx[12]].replace(/,/g, '') - data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '')) / data[/*previousYear*/ ctx[1]][/*crime*/ ctx[12]].replace(/,/g, '')) < 1) return create_if_block_6;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value_1 = /*rows*/ ctx[5][/*i*/ ctx[14]];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			if_block.c();
    			t4 = space();
    			td3 = element("td");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(td0, "padding-right", "20px");
    			attr_dev(td0, "class", "svelte-nyaqrx");
    			add_location(td0, file, 114, 6, 2567);
    			attr_dev(td1, "style", "");
    			attr_dev(td1, "class", "svelte-nyaqrx");
    			add_location(td1, file, 116, 6, 2618);
    			set_style(td2, "text-align", "right");
    			set_style(td2, "padding-right", "40px");
    			attr_dev(td2, "class", "svelte-nyaqrx");
    			add_location(td2, file, 123, 6, 2726);
    			set_style(svg, "overflow", "visible");
    			set_style(svg, "margin-bottom", "10px");
    			attr_dev(svg, "height", /*sparkHeight*/ ctx[4]);
    			attr_dev(svg, "width", "150px");
    			add_location(svg, file, 147, 8, 3893);
    			attr_dev(td3, "class", "svelte-nyaqrx");
    			add_location(td3, file, 146, 6, 3880);
    			add_location(tr, file, 112, 4, 2554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			if_block.m(td2, null);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(svg, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);

    			if (dirty & /*yearLength, rows, sparkHeight, start, crimes*/ 121) {
    				each_value_1 = /*rows*/ ctx[5][/*i*/ ctx[14]];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(112:2) {#each crimes as crime, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let th0;
    	let t0;
    	let table;
    	let tr0;
    	let th1;
    	let t2;
    	let th2;
    	let t4;
    	let th3;
    	let t6;
    	let th4;
    	let t8;
    	let tr1;
    	let t9;
    	let t10;
    	let tr2;
    	let td0;
    	let t11;
    	let td1;
    	let t12;
    	let td2;
    	let t13;
    	let td3;
    	let t14;
    	let td4;
    	let t15;
    	let td5;
    	let t16;
    	let tr3;
    	let td6;
    	let t17;
    	let td7;
    	let t18;
    	let td8;
    	let t19;
    	let td9;
    	let svg;
    	let rect;
    	let t20;
    	let span;
    	let t22;
    	let br0;
    	let br1;
    	let t23;
    	let div;
    	let each_value = /*crimes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			th0 = element("th");
    			t0 = space();
    			table = element("table");
    			tr0 = element("tr");
    			th1 = element("th");
    			th1.textContent = "Offence";
    			t2 = space();
    			th2 = element("th");
    			th2.textContent = "Number of offences in YE December 2023";
    			t4 = space();
    			th3 = element("th");
    			th3.textContent = "Percentage change compared to YE December 2022";
    			t6 = space();
    			th4 = element("th");
    			th4.textContent = "Twenty year timeline to December 2023";
    			t8 = space();
    			tr1 = element("tr");
    			t9 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			tr2 = element("tr");
    			td0 = element("td");
    			t11 = space();
    			td1 = element("td");
    			t12 = space();
    			td2 = element("td");
    			t13 = space();
    			td3 = element("td");
    			t14 = space();
    			td4 = element("td");
    			t15 = space();
    			td5 = element("td");
    			t16 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			t17 = space();
    			td7 = element("td");
    			t18 = space();
    			td8 = element("td");
    			t19 = space();
    			td9 = element("td");
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			t20 = space();
    			span = element("span");
    			span.textContent = "= Comparable data unavailable";
    			t22 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t23 = space();
    			div = element("div");
    			div.textContent = "Source: Police recorded crime from the Home Office";
    			attr_dev(th0, "class", "columnHead svelte-nyaqrx");
    			add_location(th0, file, 91, 0, 2048);
    			attr_dev(th1, "class", "columnHead svelte-nyaqrx");
    			set_style(th1, "padding-right", "20px");
    			add_location(th1, file, 95, 4, 2094);
    			attr_dev(th2, "class", "columnHead svelte-nyaqrx");
    			set_style(th2, "padding-right", "20px");
    			add_location(th2, file, 99, 4, 2174);
    			attr_dev(th3, "class", "columnHead svelte-nyaqrx");
    			set_style(th3, "padding-right", "10px");
    			add_location(th3, file, 104, 4, 2291);
    			attr_dev(th4, "class", "columnHead svelte-nyaqrx");
    			set_style(th4, "text-align", "center");
    			add_location(th4, file, 107, 4, 2410);
    			add_location(tr0, file, 94, 2, 2085);
    			add_location(tr1, file, 110, 2, 2514);
    			attr_dev(td0, "class", "svelte-nyaqrx");
    			add_location(td0, file, 217, 4, 6136);
    			attr_dev(td1, "class", "svelte-nyaqrx");
    			add_location(td1, file, 218, 4, 6147);
    			attr_dev(td2, "class", "svelte-nyaqrx");
    			add_location(td2, file, 219, 4, 6158);
    			attr_dev(td3, "class", "svelte-nyaqrx");
    			add_location(td3, file, 220, 4, 6169);
    			attr_dev(td4, "class", "svelte-nyaqrx");
    			add_location(td4, file, 221, 4, 6180);
    			attr_dev(td5, "class", "labels svelte-nyaqrx");
    			add_location(td5, file, 222, 4, 6191);
    			add_location(tr2, file, 216, 2, 6127);
    			attr_dev(td6, "class", "svelte-nyaqrx");
    			add_location(td6, file, 228, 4, 6326);
    			attr_dev(td7, "class", "svelte-nyaqrx");
    			add_location(td7, file, 229, 4, 6337);
    			attr_dev(td8, "class", "labels svelte-nyaqrx");
    			set_style(td8, "white-space", "nowrap");
    			add_location(td8, file, 231, 4, 6349);
    			attr_dev(rect, "x", "0");
    			attr_dev(rect, "y", 0);
    			attr_dev(rect, "width", "20");
    			attr_dev(rect, "height", /*sparkHeight*/ ctx[4] / 2);
    			attr_dev(rect, "fill", "lightgrey");
    			attr_dev(rect, "opacity", "0.4");
    			add_location(rect, file, 235, 8, 6563);
    			set_style(svg, "overflow", "visible");
    			set_style(svg, "padding-left", "10px");
    			attr_dev(svg, "height", /*sparkHeight*/ ctx[4]);
    			attr_dev(svg, "width", "20px");
    			add_location(svg, file, 234, 6, 6471);
    			set_style(span, "padding-left", "10px");
    			set_style(span, "overflow", "visible");
    			add_location(span, file, 243, 6, 6729);
    			attr_dev(td9, "class", "labels svelte-nyaqrx");
    			set_style(td9, "display", "flex");
    			set_style(td9, "width", "150px");
    			add_location(td9, file, 233, 4, 6410);
    			add_location(tr3, file, 227, 2, 6317);
    			add_location(table, file, 93, 0, 2075);
    			add_location(br0, file, 248, 8, 6858);
    			add_location(br1, file, 248, 12, 6862);
    			attr_dev(div, "id", "source");
    			set_style(div, "width", "100%");
    			set_style(div, "font-weight", "bold");
    			add_location(div, file, 249, 0, 6867);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, th1);
    			append_dev(tr0, t2);
    			append_dev(tr0, th2);
    			append_dev(tr0, t4);
    			append_dev(tr0, th3);
    			append_dev(tr0, t6);
    			append_dev(tr0, th4);
    			append_dev(table, t8);
    			append_dev(table, tr1);
    			append_dev(table, t9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(table, null);
    				}
    			}

    			append_dev(table, t10);
    			append_dev(table, tr2);
    			append_dev(tr2, td0);
    			append_dev(tr2, t11);
    			append_dev(tr2, td1);
    			append_dev(tr2, t12);
    			append_dev(tr2, td2);
    			append_dev(tr2, t13);
    			append_dev(tr2, td3);
    			append_dev(tr2, t14);
    			append_dev(tr2, td4);
    			append_dev(tr2, t15);
    			append_dev(tr2, td5);
    			append_dev(table, t16);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t17);
    			append_dev(tr3, td7);
    			append_dev(tr3, t18);
    			append_dev(tr3, td8);
    			append_dev(tr3, t19);
    			append_dev(tr3, td9);
    			append_dev(td9, svg);
    			append_dev(svg, rect);
    			append_dev(td9, t20);
    			append_dev(td9, span);
    			append_dev(table, t22);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sparkHeight, rows, yearLength, start, crimes, data, latestYear, previousYear, Math*/ 127) {
    				each_value = /*crimes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, t10);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let crimes = Object.keys(data["Dec 2023"]);

    	// let  crimes = ["Fraud",
    	// "Theft",
    	// "Violent crime",
    	// "Computer misuse",
    	// "Vehicle offences",
    	// "Burglary",
    	// "Robbery",
    	// "Knife and sharp instruments",
    	// "Homicide"
    	// ]
    	let years = Object.keys(data);

    	let YearBeforePrevious = years[years.length - 4];
    	let previousYear = years[years.length - 2];
    	let latestYear = years[years.length - 1];

    	let sources = {
    		'Violent crime': 'CSEW',
    		'Knife and sharp instruments': 'PRC',
    		'Homicide': 'PRC',
    		'Theft': 'CSEW',
    		'Burglary': 'PRC',
    		'Vehicle offences': 'PRC',
    		'Robbery': 'PRC',
    		'Fraud': 'CSEW',
    		'Computer misuse': 'CSEW'
    	};

    	let sig = {
    		'Violent crime': '[NS]',
    		'Knife and sharp instruments': '',
    		'Homicide': '',
    		'Theft': "&nbsp[S]",
    		'Burglary': '',
    		'Vehicle offences': '',
    		'Robbery': '',
    		'Fraud': '[NS]',
    		'Computer misuse': '[NS]'
    	};

    	let start = {
    		"Homicide": 2003,
    		"Robbery": 2003,
    		"Knife and sharp instruments": 2011
    	};

    	console.log(crimes, years, latestYear);
    	let sparkHeight = 40;

    	let makeSpark = category => {
    		let values = Object.values(data).map(e => e[category]).map(e => e != null ? e.replace(/,/g, "").trim() : e);
    		console.log("values", values);
    		let vMax = Math.max(...values.filter(e => e !== null));
    		let vMin = Math.min(...values.filter(e => e !== null));
    		let vDiff = vMax - vMin;
    		let output = values.map(e => e !== null ? (e - vMin + 1) / vDiff : -1);

    		//console.log(vMax, vMin, vDiff, category,values,output)
    		return output;
    	};

    	let rows = crimes.map(e => makeSpark(e));
    	console.log('rows', rows);
    	let yearLength = 7;
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		data,
    		crimes,
    		years,
    		YearBeforePrevious,
    		previousYear,
    		latestYear,
    		sources,
    		sig,
    		start,
    		sparkHeight,
    		makeSpark,
    		rows,
    		yearLength
    	});

    	$$self.$inject_state = $$props => {
    		if ('crimes' in $$props) $$invalidate(0, crimes = $$props.crimes);
    		if ('years' in $$props) years = $$props.years;
    		if ('YearBeforePrevious' in $$props) YearBeforePrevious = $$props.YearBeforePrevious;
    		if ('previousYear' in $$props) $$invalidate(1, previousYear = $$props.previousYear);
    		if ('latestYear' in $$props) $$invalidate(2, latestYear = $$props.latestYear);
    		if ('sources' in $$props) sources = $$props.sources;
    		if ('sig' in $$props) sig = $$props.sig;
    		if ('start' in $$props) $$invalidate(3, start = $$props.start);
    		if ('sparkHeight' in $$props) $$invalidate(4, sparkHeight = $$props.sparkHeight);
    		if ('makeSpark' in $$props) makeSpark = $$props.makeSpark;
    		if ('rows' in $$props) $$invalidate(5, rows = $$props.rows);
    		if ('yearLength' in $$props) $$invalidate(6, yearLength = $$props.yearLength);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [crimes, previousYear, latestYear, start, sparkHeight, rows, yearLength];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
