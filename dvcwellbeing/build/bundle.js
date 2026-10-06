
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_iframe_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
                // make sure an initial resize event is fired _after_ the iframe is loaded (which is asynchronous)
                // see https://github.com/sveltejs/svelte/issues/4233
                fn();
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear(year) {
      return year < 0 ? "-" + pad(-year, 6)
        : year > 9999 ? "+" + pad(year, 6)
        : pad(year, 4);
    }

    function formatDate$4(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
          : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
          : "");
    }

    function dsv(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate$4(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv = dsv(",");

    var csvParse = csv.parse;

    function autoType(object) {
      for (var key in object) {
        var value = object[key].trim(), number, m;
        if (!value) value = null;
        else if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (value === "NaN") value = NaN;
        else if (!isNaN(number = +value)) value = number;
        else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
          value = new Date(value);
        }
        else continue;
        object[key] = value;
      }
      return object;
    }

    // https://github.com/d3/d3-dsv/issues/45
    const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if (!isFinite(x) || x === 0) return null; // NaN, ±Infinity, ±0
      var i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e"), coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return prefixExponent = undefined, x.toPrecision(p);
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$1(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier, options) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = (options && options.prefix !== undefined ? options.prefix : "") + (symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : ""),
            suffix = (symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "") + (options && options.suffix !== undefined ? options.suffix : "");

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" && !isNaN(value) && prefixExponent !== undefined ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier), {suffix: prefixes[8 + e / 3]});
        return function(value) {
          return f(k * value);
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    /* src\LineChart.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\LineChart.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (221:2) {#if !row.yaxisstart}
    function create_if_block_2$2(ctx) {
    	let line;
    	let line_x__value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", /*offset*/ ctx[3]);
    			attr_dev(line, "x2", line_x__value = /*offset*/ ctx[3] + /*width*/ ctx[11]);
    			attr_dev(line, "y1", /*height*/ ctx[13]);
    			attr_dev(line, "y2", /*height*/ ctx[13]);
    			attr_dev(line, "stroke", "lightgrey");
    			attr_dev(line, "stroke-width", "3px");
    			add_location(line, file$6, 221, 3, 5310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*offset*/ 8) {
    				attr_dev(line, "x1", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*offset, width*/ 2056 && line_x__value !== (line_x__value = /*offset*/ ctx[3] + /*width*/ ctx[11])) {
    				attr_dev(line, "x2", line_x__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(221:2) {#if !row.yaxisstart}",
    		ctx
    	});

    	return block;
    }

    // (269:21) 
    function create_if_block_1$4(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_width_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = (/*i*/ ctx[27] - 1) * (/*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1)) + /*offset*/ ctx[3]);
    			attr_dev(rect, "y", 0);
    			attr_dev(rect, "width", rect_width_value = /*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1));
    			attr_dev(rect, "height", /*height*/ ctx[13]);
    			attr_dev(rect, "fill", "rgba(217, 217, 217,0.5)");
    			add_location(rect, file$6, 269, 4, 6496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*width, thisChart, offset*/ 2072 && rect_x_value !== (rect_x_value = (/*i*/ ctx[27] - 1) * (/*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1)) + /*offset*/ ctx[3])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*width, thisChart*/ 2064 && rect_width_value !== (rect_width_value = /*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1))) {
    				attr_dev(rect, "width", rect_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(269:21) ",
    		ctx
    	});

    	return block;
    }

    // (258:3) {#if +thisChart[i - 1] && +thisChart[i]}
    function create_if_block$6(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = (/*i*/ ctx[27] - 1) * (/*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1)) + /*offset*/ ctx[3]);
    			attr_dev(line, "x2", line_x__value_1 = /*i*/ ctx[27] * (/*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1)) + /*offset*/ ctx[3]);
    			attr_dev(line, "y1", line_y__value = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*i*/ ctx[27] - 1] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13]);
    			attr_dev(line, "y2", line_y__value_1 = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*i*/ ctx[27]] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13]);
    			attr_dev(line, "stroke", "rgb(32,96,149)");
    			attr_dev(line, "stroke-width", "2.5px");
    			attr_dev(line, "stroke-linecap", "round");
    			add_location(line, file$6, 258, 4, 6075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*width, thisChart, offset*/ 2072 && line_x__value !== (line_x__value = (/*i*/ ctx[27] - 1) * (/*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1)) + /*offset*/ ctx[3])) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*width, thisChart, offset*/ 2072 && line_x__value_1 !== (line_x__value_1 = /*i*/ ctx[27] * (/*width*/ ctx[11] / (/*thisChart*/ ctx[4].length - 1)) + /*offset*/ ctx[3])) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*thisChart, min, range*/ 4144 && line_y__value !== (line_y__value = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*i*/ ctx[27] - 1] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13])) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*thisChart, min, range*/ 4144 && line_y__value_1 !== (line_y__value_1 = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*i*/ ctx[27]] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13])) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(258:3) {#if +thisChart[i - 1] && +thisChart[i]}",
    		ctx
    	});

    	return block;
    }

    // (256:2) {#each thisChart as point, i}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (+/*thisChart*/ ctx[4][/*i*/ ctx[27] - 1] && +/*thisChart*/ ctx[4][/*i*/ ctx[27]]) return create_if_block$6;
    		if (/*i*/ ctx[27] !== 0) return create_if_block_1$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(256:2) {#each thisChart as point, i}",
    		ctx
    	});

    	return block;
    }

    // (288:2) {#each textLabel.split(" ") as word, i}
    function create_each_block$4(ctx) {
    	let text_1;
    	let t_value = /*word*/ ctx[25] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let text_1_dy_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "endText");
    			attr_dev(text_1, "x", text_1_x_value = /*offset*/ ctx[3] + /*width*/ ctx[11] - 10);
    			attr_dev(text_1, "y", text_1_y_value = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*thisChart*/ ctx[4].length - 1] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13]);
    			attr_dev(text_1, "dy", text_1_dy_value = 14 * (/*i*/ ctx[27] - (/*textLabel*/ ctx[10].split(" ").length - 1) / 2));
    			attr_dev(text_1, "fill", "rgb(51, 51, 51)");
    			attr_dev(text_1, "text-anchor", "start");
    			attr_dev(text_1, "dx", "1em");
    			attr_dev(text_1, "dominant-baseline", "middle");
    			attr_dev(text_1, "font-weight", /*i*/ ctx[27] !== 0 ? 400 : 700);
    			add_location(text_1, file$6, 288, 3, 6940);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*textLabel*/ 1024 && t_value !== (t_value = /*word*/ ctx[25] + "")) set_data_dev(t, t_value);

    			if (dirty & /*offset, width*/ 2056 && text_1_x_value !== (text_1_x_value = /*offset*/ ctx[3] + /*width*/ ctx[11] - 10)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*thisChart, min, range*/ 4144 && text_1_y_value !== (text_1_y_value = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*thisChart*/ ctx[4].length - 1] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13])) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*textLabel*/ 1024 && text_1_dy_value !== (text_1_dy_value = 14 * (/*i*/ ctx[27] - (/*textLabel*/ ctx[10].split(" ").length - 1) / 2))) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(288:2) {#each textLabel.split(\\\" \\\") as word, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let raw_value = /*row*/ ctx[1].headingtext + "";
    	let t0;
    	let svg;
    	let rect;
    	let line0;
    	let line1;
    	let line1_x__value;
    	let line2;
    	let line2_x__value;
    	let text0;
    	let t1_value = format(",.0f")(/*row*/ ctx[1].yaxisend) + "";
    	let t1;
    	let text0_x_value;
    	let text1;
    	let t2_value = format(",.0f")(/*row*/ ctx[1].yaxisstart) + "";
    	let t2;
    	let text1_x_value;
    	let line3;
    	let line3_x__value;
    	let line3_x__value_1;
    	let line4;
    	let text2;
    	let t3;
    	let text3;
    	let t4;
    	let text3_x_value;
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let t5;
    	let p1;
    	let t6;
    	let t7;
    	let div1_resize_listener;
    	let if_block = !/*row*/ ctx[1].yaxisstart && create_if_block_2$2(ctx);
    	let each_value_1 = /*thisChart*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*textLabel*/ ctx[10].split(" ");
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = space();
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			line2 = svg_element("line");
    			text0 = svg_element("text");
    			t1 = text(t1_value);
    			text1 = svg_element("text");
    			t2 = text(t2_value);
    			if (if_block) if_block.c();
    			line3 = svg_element("line");
    			line4 = svg_element("line");
    			text2 = svg_element("text");
    			t3 = text(/*formattedStartDate*/ ctx[9]);
    			text3 = svg_element("text");
    			t4 = text(/*formattedEndDate*/ ctx[8]);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			circle = svg_element("circle");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			p1 = element("p");
    			t6 = text("Updated: ");
    			t7 = text(/*formattedUpdated*/ ctx[7]);
    			attr_dev(p0, "class", "headingText");
    			add_location(p0, file$6, 180, 2, 4391);
    			attr_dev(div0, "class", "chartContainer");
    			add_location(div0, file$6, 179, 1, 4359);
    			attr_dev(rect, "class", "chartBackground");
    			attr_dev(rect, "x", /*offset*/ ctx[3]);
    			attr_dev(rect, "width", /*width*/ ctx[11]);
    			attr_dev(rect, "height", /*height*/ ctx[13]);
    			add_location(rect, file$6, 185, 2, 4545);
    			attr_dev(line0, "x1", /*offset*/ ctx[3]);
    			attr_dev(line0, "x2", /*offset*/ ctx[3]);
    			attr_dev(line0, "y1", "0");
    			attr_dev(line0, "y2", /*height*/ ctx[13]);
    			attr_dev(line0, "stroke", "black");
    			attr_dev(line0, "stroke-width", "0.5px");
    			add_location(line0, file$6, 187, 2, 4633);
    			attr_dev(line1, "x1", line1_x__value = /*offset*/ ctx[3] - 5);
    			attr_dev(line1, "x2", /*offset*/ ctx[3]);
    			attr_dev(line1, "y1", "0");
    			attr_dev(line1, "y2", "0");
    			attr_dev(line1, "stroke", "grey");
    			add_location(line1, file$6, 195, 2, 4751);
    			attr_dev(line2, "x1", line2_x__value = /*offset*/ ctx[3] - 5);
    			attr_dev(line2, "x2", /*offset*/ ctx[3]);
    			attr_dev(line2, "y1", /*height*/ ctx[13]);
    			attr_dev(line2, "y2", /*height*/ ctx[13]);
    			attr_dev(line2, "stroke", "grey");
    			add_location(line2, file$6, 196, 2, 4819);
    			attr_dev(text0, "x", text0_x_value = /*offset*/ ctx[3] - 5);
    			attr_dev(text0, "y", "0");
    			attr_dev(text0, "fill", "black");
    			attr_dev(text0, "text-anchor", "end");
    			attr_dev(text0, "dominant-baseline", "middle");
    			add_location(text0, file$6, 203, 2, 4920);
    			attr_dev(text1, "x", text1_x_value = /*offset*/ ctx[3] - 5);
    			attr_dev(text1, "y", /*height*/ ctx[13]);
    			attr_dev(text1, "fill", "black");
    			attr_dev(text1, "text-anchor", "end");
    			attr_dev(text1, "dominant-baseline", "middle");
    			add_location(text1, file$6, 210, 2, 5070);
    			attr_dev(line3, "x1", line3_x__value = /*offset*/ ctx[3] + /*width*/ ctx[11]);
    			attr_dev(line3, "x2", line3_x__value_1 = /*offset*/ ctx[3] + /*width*/ ctx[11]);
    			attr_dev(line3, "y1", /*height*/ ctx[13]);
    			attr_dev(line3, "y2", "115");
    			attr_dev(line3, "stroke", "grey");
    			add_location(line3, file$6, 231, 2, 5461);
    			attr_dev(line4, "x1", /*offset*/ ctx[3]);
    			attr_dev(line4, "x2", /*offset*/ ctx[3]);
    			attr_dev(line4, "y1", /*height*/ ctx[13]);
    			attr_dev(line4, "y2", "115");
    			attr_dev(line4, "stroke", "grey");
    			add_location(line4, file$6, 238, 2, 5571);
    			attr_dev(text2, "class", "startDate");
    			attr_dev(text2, "x", /*offset*/ ctx[3]);
    			attr_dev(text2, "y", /*height*/ ctx[13]);
    			attr_dev(text2, "dy", "1.5em");
    			attr_dev(text2, "dominant-baseline", "top");
    			add_location(text2, file$6, 239, 2, 5642);
    			attr_dev(text3, "class", "endDate");
    			attr_dev(text3, "x", text3_x_value = /*offset*/ ctx[3] + /*width*/ ctx[11]);
    			attr_dev(text3, "y", /*height*/ ctx[13]);
    			attr_dev(text3, "dy", "1.5em");
    			attr_dev(text3, "dominant-baseline", "top");
    			add_location(text3, file$6, 246, 2, 5778);
    			attr_dev(circle, "cx", circle_cx_value = /*offset*/ ctx[3] + /*width*/ ctx[11]);
    			attr_dev(circle, "cy", circle_cy_value = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*thisChart*/ ctx[4].length - 1] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13]);
    			attr_dev(circle, "r", "3");
    			attr_dev(circle, "fill", "#206095");
    			add_location(circle, file$6, 280, 2, 6736);
    			attr_dev(svg, "class", "chartDrawing");
    			attr_dev(svg, "width", "281");
    			add_location(svg, file$6, 183, 1, 4455);
    			attr_dev(p1, "class", "updated");
    			add_location(p1, file$6, 302, 1, 7317);
    			attr_dev(div1, "class", "graphic");
    			attr_dev(div1, "id", /*id*/ ctx[0]);
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[20].call(div1));
    			add_location(div1, file$6, 177, 0, 4255);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			p0.innerHTML = raw_value;
    			append_dev(div1, t0);
    			append_dev(div1, svg);
    			append_dev(svg, rect);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, line2);
    			append_dev(svg, text0);
    			append_dev(text0, t1);
    			append_dev(svg, text1);
    			append_dev(text1, t2);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, line3);
    			append_dev(svg, line4);
    			append_dev(svg, text2);
    			append_dev(text2, t3);
    			append_dev(svg, text3);
    			append_dev(text3, t4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(svg, null);
    				}
    			}

    			append_dev(svg, circle);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(svg, null);
    				}
    			}

    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			/*div1_binding*/ ctx[19](div1);
    			div1_resize_listener = add_iframe_resize_listener(div1, /*div1_elementresize_handler*/ ctx[20].bind(div1));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*row*/ 2 && raw_value !== (raw_value = /*row*/ ctx[1].headingtext + "")) p0.innerHTML = raw_value;
    			if (dirty & /*offset*/ 8) {
    				attr_dev(rect, "x", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*width*/ 2048) {
    				attr_dev(rect, "width", /*width*/ ctx[11]);
    			}

    			if (dirty & /*offset*/ 8) {
    				attr_dev(line0, "x1", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*offset*/ 8) {
    				attr_dev(line0, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*offset*/ 8 && line1_x__value !== (line1_x__value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(line1, "x1", line1_x__value);
    			}

    			if (dirty & /*offset*/ 8) {
    				attr_dev(line1, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*offset*/ 8 && line2_x__value !== (line2_x__value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(line2, "x1", line2_x__value);
    			}

    			if (dirty & /*offset*/ 8) {
    				attr_dev(line2, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*row*/ 2 && t1_value !== (t1_value = format(",.0f")(/*row*/ ctx[1].yaxisend) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*offset*/ 8 && text0_x_value !== (text0_x_value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(text0, "x", text0_x_value);
    			}

    			if (dirty & /*row*/ 2 && t2_value !== (t2_value = format(",.0f")(/*row*/ ctx[1].yaxisstart) + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*offset*/ 8 && text1_x_value !== (text1_x_value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(text1, "x", text1_x_value);
    			}

    			if (!/*row*/ ctx[1].yaxisstart) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(svg, line3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*offset, width*/ 2056 && line3_x__value !== (line3_x__value = /*offset*/ ctx[3] + /*width*/ ctx[11])) {
    				attr_dev(line3, "x1", line3_x__value);
    			}

    			if (dirty & /*offset, width*/ 2056 && line3_x__value_1 !== (line3_x__value_1 = /*offset*/ ctx[3] + /*width*/ ctx[11])) {
    				attr_dev(line3, "x2", line3_x__value_1);
    			}

    			if (dirty & /*offset*/ 8) {
    				attr_dev(line4, "x1", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*offset*/ 8) {
    				attr_dev(line4, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*formattedStartDate*/ 512) set_data_dev(t3, /*formattedStartDate*/ ctx[9]);

    			if (dirty & /*offset*/ 8) {
    				attr_dev(text2, "x", /*offset*/ ctx[3]);
    			}

    			if (dirty & /*formattedEndDate*/ 256) set_data_dev(t4, /*formattedEndDate*/ ctx[8]);

    			if (dirty & /*offset, width*/ 2056 && text3_x_value !== (text3_x_value = /*offset*/ ctx[3] + /*width*/ ctx[11])) {
    				attr_dev(text3, "x", text3_x_value);
    			}

    			if (dirty & /*width, thisChart, offset, height, min, range*/ 14392) {
    				each_value_1 = /*thisChart*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(svg, circle);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*offset, width*/ 2056 && circle_cx_value !== (circle_cx_value = /*offset*/ ctx[3] + /*width*/ ctx[11])) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*thisChart, min, range*/ 4144 && circle_cy_value !== (circle_cy_value = /*height*/ ctx[13] - (/*thisChart*/ ctx[4][/*thisChart*/ ctx[4].length - 1] - /*min*/ ctx[5]) / /*range*/ ctx[12] * /*height*/ ctx[13])) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*offset, width, height, thisChart, min, range, textLabel*/ 15416) {
    				each_value = /*textLabel*/ ctx[10].split(" ");
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*formattedUpdated*/ 128) set_data_dev(t7, /*formattedUpdated*/ ctx[7]);

    			if (dirty & /*id*/ 1) {
    				attr_dev(div1, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*div1_binding*/ ctx[19](null);
    			div1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function formatDate$3(dateStr) {
    	if (!dateStr) return dateStr;
    	const str = String(dateStr);

    	const monthMap = {
    		jan: "Jan",
    		feb: "Feb",
    		mar: "Mar",
    		apr: "Apr",
    		may: "May",
    		jun: "June",
    		jul: "July",
    		aug: "Aug",
    		sep: "Sept",
    		oct: "Oct",
    		nov: "Nov",
    		dec: "Dec"
    	};

    	// Handle dd-mmm-yy format (e.g. "15-Jan-25") → "15 Jan 2025"
    	const longMatch = str.match(/^(\d{1,2})-([A-Za-z]+)-(\d{2})$/);

    	if (longMatch) {
    		const month = monthMap[longMatch[2].toLowerCase()];
    		const year = 2000 + parseInt(longMatch[3]);
    		if (!month) return str;
    		return `${parseInt(longMatch[1])} ${month} ${year}`;
    	}

    	// Handle mmm-yy format (e.g. "Jan-25") → "Jan 2025"
    	const shortMatch = str.match(/^([A-Za-z]+)-(\d{2})$/);

    	if (shortMatch) {
    		const month = monthMap[shortMatch[1].toLowerCase()];

    		const year = parseInt(shortMatch[2]) >= 30
    		? 1900 + parseInt(shortMatch[2])
    		: 2000 + parseInt(shortMatch[2]);

    		if (!month) return str;
    		return `${month} ${year}`;
    	}

    	return str;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let key;
    	let thisChart;
    	let max;
    	let min;
    	let range;
    	let width;
    	let textLabel;
    	let formattedStartDate;
    	let formattedEndDate;
    	let formattedUpdated;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LineChart', slots, []);

    	const ukLocale = formatLocale({
    		decimal: ".",
    		thousands: ",",
    		grouping: [3],
    		currency: ["£", ""]
    	});

    	const ukFormat = ukLocale.format("$,.0f");
    	let { type = "line" } = $$props;
    	let { id } = $$props;
    	let { row } = $$props;
    	let { dataCharts } = $$props;
    	let chartWidth = 300, height = 110, offset = 35, rightPosition = 74;

    	//Manually setting the margins where needed
    	let offsets = [
    		["satisRship", 50],
    		["depressionAnxiety", 50],
    		["sportsPart", 50],
    		["crime", 50],
    		["diffFinance", 50],
    		["genderPaygap", 50],
    		["hholdIncome", 55],
    		["hholdWealth", 65],
    		["incomeInequal", 50],
    		["lowIncome", 50],
    		["noQuals", 50],
    		["unemployment", 50],
    		["trustOthers", 50],
    		["relyOn", 50],
    		["volunteering", 50],
    		["artsCulture", 50],
    		["belongNeigh", 50],
    		["voice", 50],
    		["GDP", 50],
    		["hopeFuture", 50],
    		["fairTreatment", 50],
    		["satisSkills", 63],
    		["satisSocial", 50],
    		["satisAccomm", 50],
    		["satisLocal", 50],
    		["satisHealth", 50],
    		["satisHealthcare", 50],
    		["satisTime", 50],
    		["satisJob", 50],
    		["satisEducation", 50],
    		["satisPolice", 50],
    		["satisCourts", 50],
    		["greenhouseGas", 40],
    		["crime", 65]
    	];

    	let rightPositions = [
    		["genderPaygap", 80],
    		["hholdWealth", 90],
    		["hholdIncome", 80],
    		["greenhouseGas", 85],
    		["unemployment", 85],
    		["satisLocal", 90],
    		["voice", 85],
    		["satisTime", 90],
    		["genderPaygap", 85],
    		["crime", 85],
    		["hholdRecycling", 80]
    	];

    	let el;

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<LineChart> was created without expected prop 'id'");
    		}

    		if (row === undefined && !('row' in $$props || $$self.$$.bound[$$self.$$.props['row']])) {
    			console.warn("<LineChart> was created without expected prop 'row'");
    		}

    		if (dataCharts === undefined && !('dataCharts' in $$props || $$self.$$.bound[$$self.$$.props['dataCharts']])) {
    			console.warn("<LineChart> was created without expected prop 'dataCharts'");
    		}
    	});

    	const writable_props = ['type', 'id', 'row', 'dataCharts'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LineChart> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(6, el);
    		});
    	}

    	function div1_elementresize_handler() {
    		chartWidth = this.clientWidth;
    		$$invalidate(2, chartWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(14, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(15, dataCharts = $$props.dataCharts);
    	};

    	$$self.$capture_state = () => ({
    		each,
    		format,
    		formatLocale,
    		ukLocale,
    		ukFormat,
    		type,
    		id,
    		row,
    		dataCharts,
    		chartWidth,
    		height,
    		offset,
    		rightPosition,
    		offsets,
    		rightPositions,
    		el,
    		formatDate: formatDate$3,
    		formattedUpdated,
    		formattedEndDate,
    		formattedStartDate,
    		thisChart,
    		key,
    		textLabel,
    		width,
    		min,
    		max,
    		range
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(14, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(15, dataCharts = $$props.dataCharts);
    		if ('chartWidth' in $$props) $$invalidate(2, chartWidth = $$props.chartWidth);
    		if ('height' in $$props) $$invalidate(13, height = $$props.height);
    		if ('offset' in $$props) $$invalidate(3, offset = $$props.offset);
    		if ('rightPosition' in $$props) $$invalidate(16, rightPosition = $$props.rightPosition);
    		if ('offsets' in $$props) $$invalidate(23, offsets = $$props.offsets);
    		if ('rightPositions' in $$props) $$invalidate(24, rightPositions = $$props.rightPositions);
    		if ('el' in $$props) $$invalidate(6, el = $$props.el);
    		if ('formattedUpdated' in $$props) $$invalidate(7, formattedUpdated = $$props.formattedUpdated);
    		if ('formattedEndDate' in $$props) $$invalidate(8, formattedEndDate = $$props.formattedEndDate);
    		if ('formattedStartDate' in $$props) $$invalidate(9, formattedStartDate = $$props.formattedStartDate);
    		if ('thisChart' in $$props) $$invalidate(4, thisChart = $$props.thisChart);
    		if ('key' in $$props) $$invalidate(17, key = $$props.key);
    		if ('textLabel' in $$props) $$invalidate(10, textLabel = $$props.textLabel);
    		if ('width' in $$props) $$invalidate(11, width = $$props.width);
    		if ('min' in $$props) $$invalidate(5, min = $$props.min);
    		if ('max' in $$props) $$invalidate(18, max = $$props.max);
    		if ('range' in $$props) $$invalidate(12, range = $$props.range);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(17, key = row.measure);
    		}

    		if ($$self.$$.dirty & /*dataCharts, key*/ 163840) {
    			$$invalidate(4, thisChart = dataCharts.map(e => e[key]).filter(e => e));
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(18, max = row.yaxisend);
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(5, min = row.yaxisstart);
    		}

    		if ($$self.$$.dirty & /*max, min*/ 262176) {
    			$$invalidate(12, range = max - min);
    		}

    		if ($$self.$$.dirty & /*key, offset, rightPosition*/ 196616) {
    			{
    				offsets.forEach(d => {
    					d[0] == key
    					? $$invalidate(3, offset = d[1])
    					: ((((($$invalidate(3, offset), $$invalidate(23, offsets)), $$invalidate(17, key)), $$invalidate(24, rightPositions)), $$invalidate(16, rightPosition)), $$invalidate(1, row));
    				});

    				rightPositions.forEach(d => {
    					d[0] == key
    					? $$invalidate(16, rightPosition = d[1])
    					: ((((($$invalidate(16, rightPosition), $$invalidate(23, offsets)), $$invalidate(17, key)), $$invalidate(3, offset)), $$invalidate(24, rightPositions)), $$invalidate(1, row));
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*chartWidth, offset, rightPosition*/ 65548) {
    			$$invalidate(11, width = chartWidth - offset - rightPosition);
    		}

    		if ($$self.$$.dirty & /*key, thisChart, row*/ 131090) {
    			$$invalidate(10, textLabel = key == "humanCapital"
    			? "£" + (Math.round(thisChart[thisChart.length - 1] * 100) / 100).toFixed(1) + " " + row.directLabelUnit
    			: (row.directLabelUnit?.includes("£"))
    				? ukFormat(thisChart[thisChart.length - 1])
    				: (row.directLabelUnit?.includes("%"))
    					? (Math.round(thisChart[thisChart.length - 1] * 10) / 10).toFixed(1) + row.directLabelUnit
    					: row.directLabelUnit
    						? (Math.round(thisChart[thisChart.length - 1] * 10) / 10).toFixed(key == "" ? 0 : 1) + " " + row.directLabelUnit
    						: key == "hholdIncome" || key == "hholdWealth"
    							? "£" + format(",.0f")(thisChart[thisChart.length - 1])
    							: thisChart[thisChart.length - 1]);
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(9, formattedStartDate = formatDate$3(row.startdate));
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(8, formattedEndDate = formatDate$3(row.enddate));
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(7, formattedUpdated = formatDate$3(row.update));
    		}
    	};

    	return [
    		id,
    		row,
    		chartWidth,
    		offset,
    		thisChart,
    		min,
    		el,
    		formattedUpdated,
    		formattedEndDate,
    		formattedStartDate,
    		textLabel,
    		width,
    		range,
    		height,
    		type,
    		dataCharts,
    		rightPosition,
    		key,
    		max,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class LineChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { type: 14, id: 0, row: 1, dataCharts: 15 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineChart",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get type() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataCharts() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataCharts(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\DualLineChart.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\DualLineChart.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    // (210:2) {#if !row.yaxisstart}
    function create_if_block_3$1(ctx) {
    	let line;
    	let line_x__value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", /*offset*/ ctx[3]);
    			attr_dev(line, "x2", line_x__value = /*offset*/ ctx[3] + /*width*/ ctx[9]);
    			attr_dev(line, "y1", /*height*/ ctx[15]);
    			attr_dev(line, "y2", /*height*/ ctx[15]);
    			attr_dev(line, "stroke", "lightgrey");
    			attr_dev(line, "stroke-width", "3px");
    			add_location(line, file$5, 210, 3, 4806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(line, "x1", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*offset, width*/ 520 && line_x__value !== (line_x__value = /*offset*/ ctx[3] + /*width*/ ctx[9])) {
    				attr_dev(line, "x2", line_x__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(210:2) {#if !row.yaxisstart}",
    		ctx
    	});

    	return block;
    }

    // (262:3) {:else}
    function create_else_block$1(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*thisChart*/ ctx[26];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*width, thisDualChart, offset, height, min, range, categories*/ 59944) {
    				each_value_2 = /*thisChart*/ ctx[26];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(262:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (248:3) {#if categories[linenumber] === "biodiversity-2"}
    function create_if_block$5(ctx) {
    	let polyline;
    	let polyline_points_value;

    	function func(...args) {
    		return /*func*/ ctx[19](/*thisChart*/ ctx[26], ...args);
    	}

    	const block = {
    		c: function create() {
    			polyline = svg_element("polyline");
    			attr_dev(polyline, "points", polyline_points_value = /*thisChart*/ ctx[26].map(func).join(" "));
    			attr_dev(polyline, "fill", "none");
    			attr_dev(polyline, "stroke", "rgb(32, 96, 149)");
    			attr_dev(polyline, "stroke-width", "2.5px");
    			attr_dev(polyline, "stroke-linecap", "butt");
    			attr_dev(polyline, "stroke-dasharray", "8 4");
    			add_location(polyline, file$5, 248, 4, 5627);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polyline, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*thisDualChart, width, offset*/ 552 && polyline_points_value !== (polyline_points_value = /*thisChart*/ ctx[26].map(func).join(" "))) {
    				attr_dev(polyline, "points", polyline_points_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polyline);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(248:3) {#if categories[linenumber] === \\\"biodiversity-2\\\"}",
    		ctx
    	});

    	return block;
    }

    // (304:42) 
    function create_if_block_2$1(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_width_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = (/*i*/ ctx[31] - 1) * (/*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1)) + /*offset*/ ctx[3]);
    			attr_dev(rect, "y", 0);
    			attr_dev(rect, "width", rect_width_value = /*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1));
    			attr_dev(rect, "height", /*height*/ ctx[15]);
    			attr_dev(rect, "fill", "rgba(217, 217, 217,0.5)");
    			add_location(rect, file$5, 304, 6, 7417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*width, thisDualChart, offset*/ 552 && rect_x_value !== (rect_x_value = (/*i*/ ctx[31] - 1) * (/*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1)) + /*offset*/ ctx[3])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*width, thisDualChart*/ 544 && rect_width_value !== (rect_width_value = /*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1))) {
    				attr_dev(rect, "width", rect_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(304:42) ",
    		ctx
    	});

    	return block;
    }

    // (265:5) {#if +thisChart[i - 1] && +thisChart[i]}
    function create_if_block_1$3(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;
    	let line_y__value;
    	let line_y__value_1;
    	let line_stroke_value;
    	let line_stroke_linecap_value;
    	let line_stroke_dasharray_value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = (/*i*/ ctx[31] - 1) * (/*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1)) + /*offset*/ ctx[3]);
    			attr_dev(line, "x2", line_x__value_1 = /*i*/ ctx[31] * (/*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1)) + /*offset*/ ctx[3]);
    			attr_dev(line, "y1", line_y__value = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*i*/ ctx[31] - 1] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15]);
    			attr_dev(line, "y2", line_y__value_1 = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*i*/ ctx[31]] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15]);

    			attr_dev(line, "stroke", line_stroke_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Female")
    			? "rgb(103, 73, 166)"
    			: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Male")
    				? "rgb(46, 161, 164)"
    				: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("sea")
    					? "rgb(32, 96, 149)"
    					: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("rural")
    						? "rgb(135, 26, 91)"
    						: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("urban")
    							? "rgb(32, 96, 149)"
    							: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-1"
    								? "rgb(246, 96, 104)"
    								: "rgb(17, 140, 123)");

    			attr_dev(line, "stroke-width", "2.5px");

    			attr_dev(line, "stroke-linecap", line_stroke_linecap_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    			? null
    			: "round");

    			attr_dev(line, "stroke-dasharray", line_stroke_dasharray_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    			? "5"
    			: null);

    			add_location(line, file$5, 265, 6, 6124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*width, thisDualChart, offset*/ 552 && line_x__value !== (line_x__value = (/*i*/ ctx[31] - 1) * (/*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1)) + /*offset*/ ctx[3])) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty[0] & /*width, thisDualChart, offset*/ 552 && line_x__value_1 !== (line_x__value_1 = /*i*/ ctx[31] * (/*width*/ ctx[9] / (/*thisChart*/ ctx[26].length - 1)) + /*offset*/ ctx[3])) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty[0] & /*thisDualChart*/ 32 && line_y__value !== (line_y__value = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*i*/ ctx[31] - 1] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15])) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty[0] & /*thisDualChart*/ 32 && line_y__value_1 !== (line_y__value_1 = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*i*/ ctx[31]] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15])) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty[0] & /*categories*/ 2048 && line_stroke_value !== (line_stroke_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Female")
    			? "rgb(103, 73, 166)"
    			: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Male")
    				? "rgb(46, 161, 164)"
    				: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("sea")
    					? "rgb(32, 96, 149)"
    					: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("rural")
    						? "rgb(135, 26, 91)"
    						: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("urban")
    							? "rgb(32, 96, 149)"
    							: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-1"
    								? "rgb(246, 96, 104)"
    								: "rgb(17, 140, 123)")) {
    				attr_dev(line, "stroke", line_stroke_value);
    			}

    			if (dirty[0] & /*categories*/ 2048 && line_stroke_linecap_value !== (line_stroke_linecap_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    			? null
    			: "round")) {
    				attr_dev(line, "stroke-linecap", line_stroke_linecap_value);
    			}

    			if (dirty[0] & /*categories*/ 2048 && line_stroke_dasharray_value !== (line_stroke_dasharray_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    			? "5"
    			: null)) {
    				attr_dev(line, "stroke-dasharray", line_stroke_dasharray_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(265:5) {#if +thisChart[i - 1] && +thisChart[i]}",
    		ctx
    	});

    	return block;
    }

    // (263:4) {#each thisChart as point, i}
    function create_each_block_2$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (+/*thisChart*/ ctx[26][/*i*/ ctx[31] - 1] && +/*thisChart*/ ctx[26][/*i*/ ctx[31]]) return create_if_block_1$3;
    		if (/*linenumber*/ ctx[28] == 0 && /*i*/ ctx[31] !== 0) return create_if_block_2$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(263:4) {#each thisChart as point, i}",
    		ctx
    	});

    	return block;
    }

    // (341:3) {#each textLabels[linenumber].split(" ") as word, i}
    function create_each_block_1$1(ctx) {
    	let text_1;
    	let t_value = /*word*/ ctx[29] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let text_1_dy_value;
    	let text_1_fill_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "endTextDual");
    			attr_dev(text_1, "x", text_1_x_value = /*offset*/ ctx[3] + /*width*/ ctx[9] - 10);
    			attr_dev(text_1, "y", text_1_y_value = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*thisChart*/ ctx[26].length - 1] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15]);
    			attr_dev(text_1, "dy", text_1_dy_value = 14 * /*i*/ ctx[31] + /*getDyAdjust*/ ctx[12](/*categories*/ ctx[11][/*linenumber*/ ctx[28]]));

    			attr_dev(text_1, "fill", text_1_fill_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Female")
    			? "rgb(103, 73, 166)"
    			: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Male")
    				? "rgb(46, 161, 164)"
    				: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("sea")
    					? "rgb(32, 96, 149)"
    					: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("rural")
    						? "rgb(135, 26, 91)"
    						: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("urban")
    							? "rgb(32, 96, 149)"
    							: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-1"
    								? "rgb(246, 96, 104)"
    								: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    									? "rgb(32, 96, 149)"
    									: "rgb(17, 140, 123)");

    			attr_dev(text_1, "text-anchor", "start");
    			attr_dev(text_1, "dx", "1em");
    			attr_dev(text_1, "dominant-baseline", "middle");
    			attr_dev(text_1, "font-weight", /*i*/ ctx[31] !== 0 ? 400 : 700);
    			add_location(text_1, file$5, 341, 4, 8538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*textLabels*/ 1024 && t_value !== (t_value = /*word*/ ctx[29] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*offset, width*/ 520 && text_1_x_value !== (text_1_x_value = /*offset*/ ctx[3] + /*width*/ ctx[9] - 10)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty[0] & /*thisDualChart*/ 32 && text_1_y_value !== (text_1_y_value = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*thisChart*/ ctx[26].length - 1] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15])) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty[0] & /*categories*/ 2048 && text_1_dy_value !== (text_1_dy_value = 14 * /*i*/ ctx[31] + /*getDyAdjust*/ ctx[12](/*categories*/ ctx[11][/*linenumber*/ ctx[28]]))) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}

    			if (dirty[0] & /*categories*/ 2048 && text_1_fill_value !== (text_1_fill_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Female")
    			? "rgb(103, 73, 166)"
    			: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Male")
    				? "rgb(46, 161, 164)"
    				: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("sea")
    					? "rgb(32, 96, 149)"
    					: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("rural")
    						? "rgb(135, 26, 91)"
    						: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("urban")
    							? "rgb(32, 96, 149)"
    							: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-1"
    								? "rgb(246, 96, 104)"
    								: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    									? "rgb(32, 96, 149)"
    									: "rgb(17, 140, 123)")) {
    				attr_dev(text_1, "fill", text_1_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(341:3) {#each textLabels[linenumber].split(\\\" \\\") as word, i}",
    		ctx
    	});

    	return block;
    }

    // (245:2) {#each thisDualChart as thisChart, linenumber}
    function create_each_block$3(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_fill_value;
    	let each_1_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2") return create_if_block$5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value_1 = /*textLabels*/ ctx[10][/*linenumber*/ ctx[28]].split(" ");
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			if_block.c();
    			circle = svg_element("circle");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(circle, "cx", circle_cx_value = /*offset*/ ctx[3] + /*width*/ ctx[9]);
    			attr_dev(circle, "cy", circle_cy_value = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*thisChart*/ ctx[26].length - 1] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15]);
    			attr_dev(circle, "r", "3");

    			attr_dev(circle, "fill", circle_fill_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Female")
    			? "rgb(103, 73, 166)"
    			: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Male")
    				? "rgb(46, 161, 164)"
    				: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("sea")
    					? "rgb(32, 96, 149)"
    					: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("rural")
    						? "rgb(135, 26, 91)"
    						: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("urban")
    							? "rgb(32, 96, 149)"
    							: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-1"
    								? "rgb(246, 96, 104)"
    								: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    									? "rgb(32, 96, 149)"
    									: "rgb(17, 140, 123)");

    			add_location(circle, file$5, 317, 3, 7694);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, circle, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(circle.parentNode, circle);
    				}
    			}

    			if (dirty[0] & /*offset, width*/ 520 && circle_cx_value !== (circle_cx_value = /*offset*/ ctx[3] + /*width*/ ctx[9])) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty[0] & /*thisDualChart*/ 32 && circle_cy_value !== (circle_cy_value = /*height*/ ctx[15] - (/*thisChart*/ ctx[26][/*thisChart*/ ctx[26].length - 1] - /*min*/ ctx[13]) / /*range*/ ctx[14] * /*height*/ ctx[15])) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty[0] & /*categories*/ 2048 && circle_fill_value !== (circle_fill_value = /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Female")
    			? "rgb(103, 73, 166)"
    			: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("Male")
    				? "rgb(46, 161, 164)"
    				: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("sea")
    					? "rgb(32, 96, 149)"
    					: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("rural")
    						? "rgb(135, 26, 91)"
    						: /*categories*/ ctx[11][/*linenumber*/ ctx[28]].includes("urban")
    							? "rgb(32, 96, 149)"
    							: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-1"
    								? "rgb(246, 96, 104)"
    								: /*categories*/ ctx[11][/*linenumber*/ ctx[28]] === "biodiversity-2"
    									? "rgb(32, 96, 149)"
    									: "rgb(17, 140, 123)")) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}

    			if (dirty[0] & /*offset, width, height, thisDualChart, min, range, getDyAdjust, categories, textLabels*/ 65064) {
    				each_value_1 = /*textLabels*/ ctx[10][/*linenumber*/ ctx[28]].split(" ");
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(circle);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(245:2) {#each thisDualChart as thisChart, linenumber}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let raw_value = /*row*/ ctx[1].headingtext + "";
    	let t0;
    	let svg;
    	let rect;
    	let line0;
    	let line1;
    	let line1_x__value;
    	let line2;
    	let line2_x__value;
    	let text0;
    	let t1_value = /*row*/ ctx[1].yaxisend + "";
    	let t1;
    	let text0_x_value;
    	let text1;
    	let t2_value = /*row*/ ctx[1].yaxisstart + "";
    	let t2;
    	let text1_x_value;
    	let line3;
    	let line3_x__value;
    	let line3_x__value_1;
    	let line4;
    	let text2;
    	let t3;
    	let text3;
    	let t4;
    	let text3_x_value;
    	let t5;
    	let p1;
    	let t6;
    	let t7;
    	let div1_resize_listener;
    	let if_block = !/*row*/ ctx[1].yaxisstart && create_if_block_3$1(ctx);
    	let each_value = /*thisDualChart*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = space();
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			line2 = svg_element("line");
    			text0 = svg_element("text");
    			t1 = text(t1_value);
    			text1 = svg_element("text");
    			t2 = text(t2_value);
    			if (if_block) if_block.c();
    			line3 = svg_element("line");
    			line4 = svg_element("line");
    			text2 = svg_element("text");
    			t3 = text(/*formattedStartDate*/ ctx[8]);
    			text3 = svg_element("text");
    			t4 = text(/*formattedEndDate*/ ctx[7]);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			p1 = element("p");
    			t6 = text("Updated: ");
    			t7 = text(/*formattedUpdated*/ ctx[6]);
    			attr_dev(p0, "class", "headingText");
    			add_location(p0, file$5, 144, 2, 3443);
    			attr_dev(div0, "class", "chartContainer");
    			add_location(div0, file$5, 143, 1, 3411);
    			attr_dev(rect, "class", "chartBackground");
    			attr_dev(rect, "x", /*offset*/ ctx[3]);
    			attr_dev(rect, "width", /*width*/ ctx[9]);
    			attr_dev(rect, "height", /*height*/ ctx[15]);
    			add_location(rect, file$5, 174, 2, 4073);
    			attr_dev(line0, "x1", /*offset*/ ctx[3]);
    			attr_dev(line0, "x2", /*offset*/ ctx[3]);
    			attr_dev(line0, "y1", "0");
    			attr_dev(line0, "y2", /*height*/ ctx[15]);
    			attr_dev(line0, "stroke", "black");
    			attr_dev(line0, "stroke-width", "0.5px");
    			add_location(line0, file$5, 176, 2, 4161);
    			attr_dev(line1, "x1", line1_x__value = /*offset*/ ctx[3] - 5);
    			attr_dev(line1, "x2", /*offset*/ ctx[3]);
    			attr_dev(line1, "y1", "0");
    			attr_dev(line1, "y2", "0");
    			attr_dev(line1, "stroke", "grey");
    			add_location(line1, file$5, 184, 2, 4279);
    			attr_dev(line2, "x1", line2_x__value = /*offset*/ ctx[3] - 5);
    			attr_dev(line2, "x2", /*offset*/ ctx[3]);
    			attr_dev(line2, "y1", /*height*/ ctx[15]);
    			attr_dev(line2, "y2", /*height*/ ctx[15]);
    			attr_dev(line2, "stroke", "grey");
    			add_location(line2, file$5, 185, 2, 4347);
    			attr_dev(text0, "x", text0_x_value = /*offset*/ ctx[3] - 5);
    			attr_dev(text0, "y", "0");
    			attr_dev(text0, "fill", "black");
    			attr_dev(text0, "text-anchor", "end");
    			attr_dev(text0, "dominant-baseline", "middle");
    			add_location(text0, file$5, 192, 2, 4448);
    			attr_dev(text1, "x", text1_x_value = /*offset*/ ctx[3] - 5);
    			attr_dev(text1, "y", /*height*/ ctx[15]);
    			attr_dev(text1, "fill", "black");
    			attr_dev(text1, "text-anchor", "end");
    			attr_dev(text1, "dominant-baseline", "middle");
    			add_location(text1, file$5, 199, 2, 4582);
    			attr_dev(line3, "x1", line3_x__value = /*offset*/ ctx[3] + /*width*/ ctx[9]);
    			attr_dev(line3, "x2", line3_x__value_1 = /*offset*/ ctx[3] + /*width*/ ctx[9]);
    			attr_dev(line3, "y1", /*height*/ ctx[15]);
    			attr_dev(line3, "y2", "115");
    			attr_dev(line3, "stroke", "grey");
    			add_location(line3, file$5, 220, 2, 4957);
    			attr_dev(line4, "x1", /*offset*/ ctx[3]);
    			attr_dev(line4, "x2", /*offset*/ ctx[3]);
    			attr_dev(line4, "y1", /*height*/ ctx[15]);
    			attr_dev(line4, "y2", "115");
    			attr_dev(line4, "stroke", "grey");
    			add_location(line4, file$5, 227, 2, 5067);
    			attr_dev(text2, "class", "startDate");
    			attr_dev(text2, "x", /*offset*/ ctx[3]);
    			attr_dev(text2, "y", /*height*/ ctx[15]);
    			attr_dev(text2, "dy", "1.5em");
    			attr_dev(text2, "dominant-baseline", "top");
    			add_location(text2, file$5, 228, 2, 5138);
    			attr_dev(text3, "class", "endDate");
    			attr_dev(text3, "x", text3_x_value = /*offset*/ ctx[3] + /*width*/ ctx[9]);
    			attr_dev(text3, "y", /*height*/ ctx[15]);
    			attr_dev(text3, "dy", "1.5em");
    			attr_dev(text3, "dominant-baseline", "top");
    			add_location(text3, file$5, 235, 2, 5274);
    			attr_dev(svg, "class", "chartDrawing");
    			attr_dev(svg, "width", "281");
    			add_location(svg, file$5, 172, 1, 3983);
    			attr_dev(p1, "class", "updated");
    			add_location(p1, file$5, 373, 1, 9574);
    			attr_dev(div1, "class", "graphic");
    			attr_dev(div1, "id", /*id*/ ctx[0]);
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[21].call(div1));
    			add_location(div1, file$5, 141, 0, 3307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			p0.innerHTML = raw_value;
    			append_dev(div1, t0);
    			append_dev(div1, svg);
    			append_dev(svg, rect);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, line2);
    			append_dev(svg, text0);
    			append_dev(text0, t1);
    			append_dev(svg, text1);
    			append_dev(text1, t2);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, line3);
    			append_dev(svg, line4);
    			append_dev(svg, text2);
    			append_dev(text2, t3);
    			append_dev(svg, text3);
    			append_dev(text3, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(svg, null);
    				}
    			}

    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			/*div1_binding*/ ctx[20](div1);
    			div1_resize_listener = add_iframe_resize_listener(div1, /*div1_elementresize_handler*/ ctx[21].bind(div1));
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*row*/ 2 && raw_value !== (raw_value = /*row*/ ctx[1].headingtext + "")) p0.innerHTML = raw_value;
    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(rect, "x", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*width*/ 512) {
    				attr_dev(rect, "width", /*width*/ ctx[9]);
    			}

    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(line0, "x1", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(line0, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*offset*/ 8 && line1_x__value !== (line1_x__value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(line1, "x1", line1_x__value);
    			}

    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(line1, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*offset*/ 8 && line2_x__value !== (line2_x__value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(line2, "x1", line2_x__value);
    			}

    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(line2, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*row*/ 2 && t1_value !== (t1_value = /*row*/ ctx[1].yaxisend + "")) set_data_dev(t1, t1_value);

    			if (dirty[0] & /*offset*/ 8 && text0_x_value !== (text0_x_value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(text0, "x", text0_x_value);
    			}

    			if (dirty[0] & /*row*/ 2 && t2_value !== (t2_value = /*row*/ ctx[1].yaxisstart + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*offset*/ 8 && text1_x_value !== (text1_x_value = /*offset*/ ctx[3] - 5)) {
    				attr_dev(text1, "x", text1_x_value);
    			}

    			if (!/*row*/ ctx[1].yaxisstart) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(svg, line3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*offset, width*/ 520 && line3_x__value !== (line3_x__value = /*offset*/ ctx[3] + /*width*/ ctx[9])) {
    				attr_dev(line3, "x1", line3_x__value);
    			}

    			if (dirty[0] & /*offset, width*/ 520 && line3_x__value_1 !== (line3_x__value_1 = /*offset*/ ctx[3] + /*width*/ ctx[9])) {
    				attr_dev(line3, "x2", line3_x__value_1);
    			}

    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(line4, "x1", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(line4, "x2", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*formattedStartDate*/ 256) set_data_dev(t3, /*formattedStartDate*/ ctx[8]);

    			if (dirty[0] & /*offset*/ 8) {
    				attr_dev(text2, "x", /*offset*/ ctx[3]);
    			}

    			if (dirty[0] & /*formattedEndDate*/ 128) set_data_dev(t4, /*formattedEndDate*/ ctx[7]);

    			if (dirty[0] & /*offset, width*/ 520 && text3_x_value !== (text3_x_value = /*offset*/ ctx[3] + /*width*/ ctx[9])) {
    				attr_dev(text3, "x", text3_x_value);
    			}

    			if (dirty[0] & /*textLabels, offset, width, height, thisDualChart, min, range, getDyAdjust, categories*/ 65064) {
    				each_value = /*thisDualChart*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*formattedUpdated*/ 64) set_data_dev(t7, /*formattedUpdated*/ ctx[6]);

    			if (dirty[0] & /*id*/ 1) {
    				attr_dev(div1, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			/*div1_binding*/ ctx[20](null);
    			div1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function formatDate$2(dateStr) {
    	if (!dateStr) return dateStr;
    	const str = String(dateStr);

    	const monthMap = {
    		jan: "Jan",
    		feb: "Feb",
    		mar: "Mar",
    		apr: "Apr",
    		may: "May",
    		jun: "June",
    		jul: "July",
    		aug: "Aug",
    		sep: "Sept",
    		oct: "Oct",
    		nov: "Nov",
    		dec: "Dec"
    	};

    	// Handle dd-mmm-yy format (e.g. "15-Jan-25") → "15 Jan 2025"
    	const longMatch = str.match(/^(\d{1,2})-([A-Za-z]+)-(\d{2})$/);

    	if (longMatch) {
    		const month = monthMap[longMatch[2].toLowerCase()];
    		const year = 2000 + parseInt(longMatch[3]);
    		if (!month) return str;
    		return `${parseInt(longMatch[1])} ${month} ${year}`;
    	}

    	// Handle mmm-yy format (e.g. "Jan-25") → "Jan 2025"
    	const shortMatch = str.match(/^([A-Za-z]+)-(\d{2})$/);

    	if (shortMatch) {
    		const month = monthMap[shortMatch[1].toLowerCase()];

    		const year = parseInt(shortMatch[2]) >= 30
    		? 1900 + parseInt(shortMatch[2])
    		: 2000 + parseInt(shortMatch[2]);

    		if (!month) return str;
    		return `${month} ${year}`;
    	}

    	return str;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let key;
    	let thisDualChart;
    	let categories;
    	let textLabels;
    	let width;
    	let formattedStartDate;
    	let formattedEndDate;
    	let formattedUpdated;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DualLineChart', slots, []);
    	let { type = "dualLine" } = $$props;
    	let { id } = $$props;
    	let { row } = $$props;
    	let { dataCharts } = $$props;

    	// console.log(textLabels);
    	//Manually positioning labels where needed
    	let dyAdjusts = [
    		["lifeExpect-Females", -40],
    		["lifeExpect-Males", 5],
    		["unpaidWork-Females", -20],
    		["unpaidWork-Males", -5],
    		["feelingSafe-Males", -10],
    		["protectedArea", -35],
    		["protectedArea-sea", -45],
    		["airPoll-urban", -5],
    		["airPoll-rural", -40],
    		["biodiversity-1", -7],
    		["biodiversity-2", 7]
    	];

    	function getDyAdjust(cat) {
    		let adjust = dyAdjusts.find(d => d[0] == cat);

    		if (adjust) {
    			return adjust[1];
    		} else {
    			return 0;
    		}
    	}

    	let max = row.yaxisend;
    	let min = row.yaxisstart;
    	let range = max - min;
    	let chartWidth = 300, height = 110, offset = 35, rightPosition = 90;

    	//Manually setting the margins where needed
    	let offsets = [["feelingSafe", 65]];

    	let el;

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<DualLineChart> was created without expected prop 'id'");
    		}

    		if (row === undefined && !('row' in $$props || $$self.$$.bound[$$self.$$.props['row']])) {
    			console.warn("<DualLineChart> was created without expected prop 'row'");
    		}

    		if (dataCharts === undefined && !('dataCharts' in $$props || $$self.$$.bound[$$self.$$.props['dataCharts']])) {
    			console.warn("<DualLineChart> was created without expected prop 'dataCharts'");
    		}
    	});

    	const writable_props = ['type', 'id', 'row', 'dataCharts'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DualLineChart> was created with unknown prop '${key}'`);
    	});

    	const func = (thisChart, point, i) => `${i * (width / (thisChart.length - 1)) + offset},${height - (point - min) / range * height}`;

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(4, el);
    		});
    	}

    	function div1_elementresize_handler() {
    		chartWidth = this.clientWidth;
    		$$invalidate(2, chartWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(16, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(17, dataCharts = $$props.dataCharts);
    	};

    	$$self.$capture_state = () => ({
    		each,
    		text,
    		onMount,
    		type,
    		id,
    		row,
    		dataCharts,
    		dyAdjusts,
    		getDyAdjust,
    		max,
    		min,
    		range,
    		chartWidth,
    		height,
    		offset,
    		rightPosition,
    		offsets,
    		el,
    		formatDate: formatDate$2,
    		formattedUpdated,
    		formattedEndDate,
    		formattedStartDate,
    		width,
    		key,
    		textLabels,
    		thisDualChart,
    		categories
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(16, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(17, dataCharts = $$props.dataCharts);
    		if ('dyAdjusts' in $$props) dyAdjusts = $$props.dyAdjusts;
    		if ('max' in $$props) max = $$props.max;
    		if ('min' in $$props) $$invalidate(13, min = $$props.min);
    		if ('range' in $$props) $$invalidate(14, range = $$props.range);
    		if ('chartWidth' in $$props) $$invalidate(2, chartWidth = $$props.chartWidth);
    		if ('height' in $$props) $$invalidate(15, height = $$props.height);
    		if ('offset' in $$props) $$invalidate(3, offset = $$props.offset);
    		if ('rightPosition' in $$props) $$invalidate(24, rightPosition = $$props.rightPosition);
    		if ('offsets' in $$props) $$invalidate(25, offsets = $$props.offsets);
    		if ('el' in $$props) $$invalidate(4, el = $$props.el);
    		if ('formattedUpdated' in $$props) $$invalidate(6, formattedUpdated = $$props.formattedUpdated);
    		if ('formattedEndDate' in $$props) $$invalidate(7, formattedEndDate = $$props.formattedEndDate);
    		if ('formattedStartDate' in $$props) $$invalidate(8, formattedStartDate = $$props.formattedStartDate);
    		if ('width' in $$props) $$invalidate(9, width = $$props.width);
    		if ('key' in $$props) $$invalidate(18, key = $$props.key);
    		if ('textLabels' in $$props) $$invalidate(10, textLabels = $$props.textLabels);
    		if ('thisDualChart' in $$props) $$invalidate(5, thisDualChart = $$props.thisDualChart);
    		if ('categories' in $$props) $$invalidate(11, categories = $$props.categories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*row*/ 2) {
    			$$invalidate(18, key = row.measure);
    		}

    		if ($$self.$$.dirty[0] & /*dataCharts, key*/ 393216) {
    			{
    				dataCharts.columns.filter(e => e.startsWith(key)).forEach((el, i) => {
    					// thisDualChart[i] = Object.fromEntries([
    					// 	[el, dataCharts.map((e) => e[el]).filter((e) => e)],
    					// ]);
    					$$invalidate(11, categories[i] = el, categories);

    					$$invalidate(5, thisDualChart[i] = dataCharts.map(e => e[el]).filter(e => e), thisDualChart);
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*thisDualChart, row*/ 34) {
    			thisDualChart.forEach((d, i) => {
    				$$invalidate(
    					10,
    					textLabels[i] = (Math.round(d[d.length - 1] * 10) / 10).toFixed(1) + ((row.directLabelUnit?.includes("%"))
    					? i == 0 ? row.directLabelUnit : row.directLabelUnit2
    					: i == 0
    						? " " + row.directLabelUnit
    						: " " + row.directLabelUnit2),
    					textLabels
    				);
    			});
    		}

    		if ($$self.$$.dirty[0] & /*key, offset*/ 262152) {
    			{
    				offsets.forEach(d => {
    					d[0] == key
    					? $$invalidate(3, offset = d[1])
    					: ((($$invalidate(3, offset), $$invalidate(25, offsets)), $$invalidate(18, key)), $$invalidate(1, row));
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*chartWidth, offset*/ 12) {
    			$$invalidate(9, width = chartWidth - offset - rightPosition);
    		}

    		if ($$self.$$.dirty[0] & /*row*/ 2) {
    			$$invalidate(8, formattedStartDate = formatDate$2(row.startdate));
    		}

    		if ($$self.$$.dirty[0] & /*row*/ 2) {
    			$$invalidate(7, formattedEndDate = formatDate$2(row.enddate));
    		}

    		if ($$self.$$.dirty[0] & /*row*/ 2) {
    			$$invalidate(6, formattedUpdated = formatDate$2(row.update));
    		}
    	};

    	$$invalidate(5, thisDualChart = []);
    	$$invalidate(11, categories = []);

    	// console.log(row, categories, thisDualChart);
    	//Direct line labels
    	$$invalidate(10, textLabels = []);

    	return [
    		id,
    		row,
    		chartWidth,
    		offset,
    		el,
    		thisDualChart,
    		formattedUpdated,
    		formattedEndDate,
    		formattedStartDate,
    		width,
    		textLabels,
    		categories,
    		getDyAdjust,
    		min,
    		range,
    		height,
    		type,
    		dataCharts,
    		key,
    		func,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class DualLineChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { type: 16, id: 0, row: 1, dataCharts: 17 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DualLineChart",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get type() {
    		throw new Error("<DualLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<DualLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<DualLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<DualLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<DualLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<DualLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataCharts() {
    		throw new Error("<DualLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataCharts(value) {
    		throw new Error("<DualLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function ascending(a, b) {
      return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function descending(a, b) {
      return a == null || b == null ? NaN
        : b < a ? -1
        : b > a ? 1
        : b >= a ? 0
        : NaN;
    }

    function bisector(f) {
      let compare1, compare2, delta;

      // If an accessor is specified, promote it to a comparator. In this case we
      // can test whether the search value is (self-) comparable. We can’t do this
      // for a comparator (except for specific, known comparators) because we can’t
      // tell if the comparator is symmetric, and an asymmetric comparator can’t be
      // used to test whether a single value is comparable.
      if (f.length !== 2) {
        compare1 = ascending;
        compare2 = (d, x) => ascending(f(d), x);
        delta = (d, x) => f(d) - x;
      } else {
        compare1 = f === ascending || f === descending ? f : zero$1;
        compare2 = f;
        delta = f;
      }

      function left(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function right(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) <= 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function center(a, x, lo = 0, hi = a.length) {
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function zero$1() {
      return 0;
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    const e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function tickSpec(start, stop, count) {
      const step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log10(step)),
          error = step / Math.pow(10, power),
          factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
      let i1, i2, inc;
      if (power < 0) {
        inc = Math.pow(10, -power) / factor;
        i1 = Math.round(start * inc);
        i2 = Math.round(stop * inc);
        if (i1 / inc < start) ++i1;
        if (i2 / inc > stop) --i2;
        inc = -inc;
      } else {
        inc = Math.pow(10, power) * factor;
        i1 = Math.round(start / inc);
        i2 = Math.round(stop / inc);
        if (i1 * inc < start) ++i1;
        if (i2 * inc > stop) --i2;
      }
      if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
      return [i1, i2, inc];
    }

    function ticks(start, stop, count) {
      stop = +stop, start = +start, count = +count;
      if (!(count > 0)) return [];
      if (start === stop) return [start];
      const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
      if (!(i2 >= i1)) return [];
      const n = i2 - i1 + 1, ticks = new Array(n);
      if (reverse) {
        if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
        else for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
      } else {
        if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
        else for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
      }
      return ticks;
    }

    function tickIncrement(start, stop, count) {
      stop = +stop, start = +start, count = +count;
      return tickSpec(start, stop, count)[2];
    }

    function tickStep(start, stop, count) {
      stop = +stop, start = +start, count = +count;
      const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
      return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
        reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
        reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
        reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
        reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
        reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHex8: color_formatHex8,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHex8() {
      return this.rgb().formatHex8();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
      },
      displayable() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatHex8: rgb_formatHex8,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
    }

    function rgb_formatHex8() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
    }

    function rgb_formatRgb() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
    }

    function clampa(opacity) {
      return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    }

    function clampi(value) {
      return Math.max(0, Math.min(255, Math.round(value) || 0));
    }

    function hex(value) {
      value = clampi(value);
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb$1(h, m1, m2),
          hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      clamp() {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
      },
      displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl() {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
      }
    }));

    function clamph(value) {
      value = (value || 0) % 360;
      return value < 0 ? value + 360 : value;
    }

    function clampt(value) {
      return Math.max(0, Math.min(1, value || 0));
    }

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb$1(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity, rescale()) : clamp !== identity;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity, identity);
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    /* src\ColumnChart.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\ColumnChart.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (129:2) {#if !row.yaxisstart}
    function create_if_block$4(ctx) {
    	let line;
    	let line_x__value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", "35");
    			attr_dev(line, "x2", line_x__value = 35 + (/*chartWidth*/ ctx[2] - 104));
    			attr_dev(line, "y1", "110");
    			attr_dev(line, "y2", "110");
    			attr_dev(line, "stroke", "lightgrey");
    			attr_dev(line, "stroke-width", "3px");
    			add_location(line, file$4, 129, 3, 3241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*chartWidth*/ 4 && line_x__value !== (line_x__value = 35 + (/*chartWidth*/ ctx[2] - 104))) {
    				attr_dev(line, "x2", line_x__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(129:2) {#if !row.yaxisstart}",
    		ctx
    	});

    	return block;
    }

    // (170:2) {#each thisChart as point, i}
    function create_each_block$2(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_height_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = 35 + /*i*/ ctx[22] * /*barWidth*/ ctx[9] * 10 / 9);
    			attr_dev(rect, "y", rect_y_value = /*height*/ ctx[12] - /*yScale*/ ctx[8](/*point*/ ctx[20]));
    			attr_dev(rect, "width", /*barWidth*/ ctx[9]);
    			attr_dev(rect, "height", rect_height_value = /*yScale*/ ctx[8](/*point*/ ctx[20]));
    			attr_dev(rect, "fill", "rgb(32, 96, 149)");
    			add_location(rect, file$4, 170, 3, 4016);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*barWidth*/ 512 && rect_x_value !== (rect_x_value = 35 + /*i*/ ctx[22] * /*barWidth*/ ctx[9] * 10 / 9)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*yScale, thisChart*/ 264 && rect_y_value !== (rect_y_value = /*height*/ ctx[12] - /*yScale*/ ctx[8](/*point*/ ctx[20]))) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*barWidth*/ 512) {
    				attr_dev(rect, "width", /*barWidth*/ ctx[9]);
    			}

    			if (dirty & /*yScale, thisChart*/ 264 && rect_height_value !== (rect_height_value = /*yScale*/ ctx[8](/*point*/ ctx[20]))) {
    				attr_dev(rect, "height", rect_height_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(170:2) {#each thisChart as point, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = /*row*/ ctx[1].headingtext + "";
    	let t0;
    	let t1;
    	let svg;
    	let rect;
    	let rect_width_value;
    	let line0;
    	let line1;
    	let line2;
    	let text0;
    	let t2_value = /*row*/ ctx[1].yaxisend + "";
    	let t2;
    	let text1;
    	let t3_value = /*row*/ ctx[1].yaxisstart + "";
    	let t3;
    	let line3;
    	let line3_x__value;
    	let line3_x__value_1;
    	let line4;
    	let line4_x__value;
    	let line4_x__value_1;
    	let text2;
    	let t4;
    	let text2_x_value;
    	let text3;
    	let t5;
    	let text3_x_value;
    	let text4;
    	let t6_value = (Math.round(/*thisChart*/ ctx[3][/*thisChart*/ ctx[3].length - 1] * 10) / 10).toFixed(1) + "";
    	let t6;

    	let t7_value = ((/*row*/ ctx[1].directLabelUnit?.includes("%"))
    	? /*row*/ ctx[1].directLabelUnit
    	: " " + /*row*/ ctx[1].directLabelUnit) + "";

    	let t7;
    	let text4_x_value;
    	let text4_y_value;
    	let t8;
    	let p1;
    	let t9;
    	let t10;
    	let div1_resize_listener;
    	let if_block = !/*row*/ ctx[1].yaxisstart && create_if_block$4(ctx);
    	let each_value = /*thisChart*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			line2 = svg_element("line");
    			text0 = svg_element("text");
    			t2 = text(t2_value);
    			text1 = svg_element("text");
    			t3 = text(t3_value);
    			if (if_block) if_block.c();
    			line3 = svg_element("line");
    			line4 = svg_element("line");
    			text2 = svg_element("text");
    			t4 = text(/*formattedStartDate*/ ctx[7]);
    			text3 = svg_element("text");
    			t5 = text(/*formattedEndDate*/ ctx[6]);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			text4 = svg_element("text");
    			t6 = text(t6_value);
    			t7 = text(t7_value);
    			t8 = space();
    			p1 = element("p");
    			t9 = text("Updated: ");
    			t10 = text(/*formattedUpdated*/ ctx[5]);
    			attr_dev(p0, "class", "headingText");
    			add_location(p0, file$4, 89, 2, 2406);
    			attr_dev(div0, "class", "chartContainer");
    			add_location(div0, file$4, 88, 1, 2374);
    			attr_dev(rect, "class", "chartBackground");
    			attr_dev(rect, "x", "35");
    			attr_dev(rect, "width", rect_width_value = /*chartWidth*/ ctx[2] - 104);
    			attr_dev(rect, "height", "110");
    			add_location(rect, file$4, 94, 2, 2554);
    			attr_dev(line0, "x1", "35");
    			attr_dev(line0, "x2", "35");
    			attr_dev(line0, "y1", "0");
    			attr_dev(line0, "y2", "110");
    			attr_dev(line0, "stroke", "black");
    			attr_dev(line0, "stroke-width", "0.5px");
    			add_location(line0, file$4, 101, 2, 2679);
    			attr_dev(line1, "x1", "30");
    			attr_dev(line1, "x2", "35");
    			attr_dev(line1, "y1", "0");
    			attr_dev(line1, "y2", "0");
    			attr_dev(line1, "stroke", "grey");
    			add_location(line1, file$4, 109, 2, 2786);
    			attr_dev(line2, "x1", "30");
    			attr_dev(line2, "x2", "35");
    			attr_dev(line2, "y1", "110");
    			attr_dev(line2, "y2", "110");
    			attr_dev(line2, "stroke", "grey");
    			add_location(line2, file$4, 110, 2, 2842);
    			attr_dev(text0, "x", "30");
    			attr_dev(text0, "y", "0");
    			attr_dev(text0, "fill", "black");
    			attr_dev(text0, "text-anchor", "end");
    			attr_dev(text0, "dominant-baseline", "middle");
    			add_location(text0, file$4, 111, 2, 2902);
    			attr_dev(text1, "x", "30");
    			attr_dev(text1, "y", "110");
    			attr_dev(text1, "fill", "black");
    			attr_dev(text1, "text-anchor", "end");
    			attr_dev(text1, "dominant-baseline", "middle");
    			add_location(text1, file$4, 118, 2, 3028);
    			attr_dev(line3, "x1", line3_x__value = 35 + (/*chartWidth*/ ctx[2] - 104) - /*barWidth*/ ctx[9] / 2);
    			attr_dev(line3, "x2", line3_x__value_1 = 35 + (/*chartWidth*/ ctx[2] - 104) - /*barWidth*/ ctx[9] / 2);
    			attr_dev(line3, "y1", "110");
    			attr_dev(line3, "y2", "115");
    			attr_dev(line3, "stroke", "grey");
    			add_location(line3, file$4, 139, 2, 3391);
    			attr_dev(line4, "x1", line4_x__value = 35 + /*barWidth*/ ctx[9] / 2);
    			attr_dev(line4, "x2", line4_x__value_1 = 35 + /*barWidth*/ ctx[9] / 2);
    			attr_dev(line4, "y1", "110");
    			attr_dev(line4, "y2", "115");
    			attr_dev(line4, "stroke", "grey");
    			add_location(line4, file$4, 146, 2, 3546);
    			attr_dev(text2, "class", "startDate");
    			attr_dev(text2, "x", text2_x_value = 35 + /*barWidth*/ ctx[9] / 2);
    			attr_dev(text2, "y", "110");
    			attr_dev(text2, "dy", "1.5em");
    			attr_dev(text2, "dominant-baseline", "top");
    			add_location(text2, file$4, 153, 2, 3659);
    			attr_dev(text3, "class", "endDate");
    			attr_dev(text3, "x", text3_x_value = 35 + (/*chartWidth*/ ctx[2] - 104) - /*barWidth*/ ctx[9] / 2);
    			attr_dev(text3, "y", "110");
    			attr_dev(text3, "dy", "1.5em");
    			attr_dev(text3, "dominant-baseline", "top");
    			add_location(text3, file$4, 160, 2, 3803);
    			attr_dev(text4, "class", "endText");
    			attr_dev(text4, "x", text4_x_value = 25 + (/*chartWidth*/ ctx[2] - 104));
    			attr_dev(text4, "y", text4_y_value = /*height*/ ctx[12] - (/*thisChart*/ ctx[3][/*thisChart*/ ctx[3].length - 1] - /*min*/ ctx[10]) / /*range*/ ctx[11] * /*height*/ ctx[12]);
    			attr_dev(text4, "fill", "rgb(51, 51, 51)");
    			attr_dev(text4, "text-anchor", "start");
    			attr_dev(text4, "dx", "1em");
    			attr_dev(text4, "dominant-baseline", "middle");
    			attr_dev(text4, "font-weight", "700");
    			add_location(text4, file$4, 180, 2, 4215);
    			attr_dev(svg, "class", "chartDrawing");
    			attr_dev(svg, "width", "281");
    			add_location(svg, file$4, 92, 1, 2464);
    			attr_dev(p1, "class", "updated");
    			add_location(p1, file$4, 198, 1, 4680);
    			attr_dev(div1, "class", "graphic");
    			attr_dev(div1, "id", /*id*/ ctx[0]);
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[18].call(div1));
    			add_location(div1, file$4, 86, 0, 2270);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, svg);
    			append_dev(svg, rect);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, line2);
    			append_dev(svg, text0);
    			append_dev(text0, t2);
    			append_dev(svg, text1);
    			append_dev(text1, t3);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, line3);
    			append_dev(svg, line4);
    			append_dev(svg, text2);
    			append_dev(text2, t4);
    			append_dev(svg, text3);
    			append_dev(text3, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(svg, null);
    				}
    			}

    			append_dev(svg, text4);
    			append_dev(text4, t6);
    			append_dev(text4, t7);
    			append_dev(div1, t8);
    			append_dev(div1, p1);
    			append_dev(p1, t9);
    			append_dev(p1, t10);
    			/*div1_binding*/ ctx[17](div1);
    			div1_resize_listener = add_iframe_resize_listener(div1, /*div1_elementresize_handler*/ ctx[18].bind(div1));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*row*/ 2 && t0_value !== (t0_value = /*row*/ ctx[1].headingtext + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*chartWidth*/ 4 && rect_width_value !== (rect_width_value = /*chartWidth*/ ctx[2] - 104)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*row*/ 2 && t2_value !== (t2_value = /*row*/ ctx[1].yaxisend + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*row*/ 2 && t3_value !== (t3_value = /*row*/ ctx[1].yaxisstart + "")) set_data_dev(t3, t3_value);

    			if (!/*row*/ ctx[1].yaxisstart) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(svg, line3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*chartWidth, barWidth*/ 516 && line3_x__value !== (line3_x__value = 35 + (/*chartWidth*/ ctx[2] - 104) - /*barWidth*/ ctx[9] / 2)) {
    				attr_dev(line3, "x1", line3_x__value);
    			}

    			if (dirty & /*chartWidth, barWidth*/ 516 && line3_x__value_1 !== (line3_x__value_1 = 35 + (/*chartWidth*/ ctx[2] - 104) - /*barWidth*/ ctx[9] / 2)) {
    				attr_dev(line3, "x2", line3_x__value_1);
    			}

    			if (dirty & /*barWidth*/ 512 && line4_x__value !== (line4_x__value = 35 + /*barWidth*/ ctx[9] / 2)) {
    				attr_dev(line4, "x1", line4_x__value);
    			}

    			if (dirty & /*barWidth*/ 512 && line4_x__value_1 !== (line4_x__value_1 = 35 + /*barWidth*/ ctx[9] / 2)) {
    				attr_dev(line4, "x2", line4_x__value_1);
    			}

    			if (dirty & /*formattedStartDate*/ 128) set_data_dev(t4, /*formattedStartDate*/ ctx[7]);

    			if (dirty & /*barWidth*/ 512 && text2_x_value !== (text2_x_value = 35 + /*barWidth*/ ctx[9] / 2)) {
    				attr_dev(text2, "x", text2_x_value);
    			}

    			if (dirty & /*formattedEndDate*/ 64) set_data_dev(t5, /*formattedEndDate*/ ctx[6]);

    			if (dirty & /*chartWidth, barWidth*/ 516 && text3_x_value !== (text3_x_value = 35 + (/*chartWidth*/ ctx[2] - 104) - /*barWidth*/ ctx[9] / 2)) {
    				attr_dev(text3, "x", text3_x_value);
    			}

    			if (dirty & /*barWidth, height, yScale, thisChart*/ 4872) {
    				each_value = /*thisChart*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, text4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*thisChart*/ 8 && t6_value !== (t6_value = (Math.round(/*thisChart*/ ctx[3][/*thisChart*/ ctx[3].length - 1] * 10) / 10).toFixed(1) + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*row*/ 2 && t7_value !== (t7_value = ((/*row*/ ctx[1].directLabelUnit?.includes("%"))
    			? /*row*/ ctx[1].directLabelUnit
    			: " " + /*row*/ ctx[1].directLabelUnit) + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*chartWidth*/ 4 && text4_x_value !== (text4_x_value = 25 + (/*chartWidth*/ ctx[2] - 104))) {
    				attr_dev(text4, "x", text4_x_value);
    			}

    			if (dirty & /*thisChart*/ 8 && text4_y_value !== (text4_y_value = /*height*/ ctx[12] - (/*thisChart*/ ctx[3][/*thisChart*/ ctx[3].length - 1] - /*min*/ ctx[10]) / /*range*/ ctx[11] * /*height*/ ctx[12])) {
    				attr_dev(text4, "y", text4_y_value);
    			}

    			if (dirty & /*formattedUpdated*/ 32) set_data_dev(t10, /*formattedUpdated*/ ctx[5]);

    			if (dirty & /*id*/ 1) {
    				attr_dev(div1, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			/*div1_binding*/ ctx[17](null);
    			div1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function formatDate$1(dateStr) {
    	if (!dateStr) return dateStr;
    	const str = String(dateStr);

    	const monthMap = {
    		jan: "Jan",
    		feb: "Feb",
    		mar: "Mar",
    		apr: "Apr",
    		may: "May",
    		jun: "June",
    		jul: "July",
    		aug: "Aug",
    		sep: "Sept",
    		oct: "Oct",
    		nov: "Nov",
    		dec: "Dec"
    	};

    	// Handle dd-mmm-yy format (e.g. "15-Jan-25") → "15 Jan 2025"
    	const longMatch = str.match(/^(\d{1,2})-([A-Za-z]+)-(\d{2})$/);

    	if (longMatch) {
    		const month = monthMap[longMatch[2].toLowerCase()];
    		const year = 2000 + parseInt(longMatch[3]);
    		if (!month) return str;
    		return `${parseInt(longMatch[1])} ${month} ${year}`;
    	}

    	// Handle dd-mmm format (e.g. "26-Apr") → "26 Apr"
    	const noYearMatch = str.match(/^(\d{1,2})-([A-Za-z]+)$/);

    	if (noYearMatch) {
    		const month = monthMap[noYearMatch[2].toLowerCase()];
    		if (!month) return str;
    		return `${parseInt(noYearMatch[1])} ${month}`;
    	}

    	// Handle mmm-yy format (e.g. "Jan-25") → "Jan 2025"
    	const shortMatch = str.match(/^([A-Za-z]+)-(\d{2})$/);

    	if (shortMatch) {
    		const month = monthMap[shortMatch[1].toLowerCase()];

    		const year = parseInt(shortMatch[2]) >= 30
    		? 1900 + parseInt(shortMatch[2])
    		: 2000 + parseInt(shortMatch[2]);

    		if (!month) return str;
    		return `${month} ${year}`;
    	}

    	return str;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let key;
    	let thisChart;
    	let barWidth;
    	let yScale;
    	let formattedStartDate;
    	let formattedEndDate;
    	let formattedUpdated;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColumnChart', slots, []);
    	let { type = "bar" } = $$props;
    	let { id } = $$props;
    	let { row } = $$props;
    	let { dataCharts } = $$props;
    	let { dataText } = $$props;

    	// console.log(thisChart);
    	let max = row.yaxisend;

    	let min = row.yaxisstart;
    	let range = max - min;
    	let chartWidth = 300, height = 110;
    	let el;

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<ColumnChart> was created without expected prop 'id'");
    		}

    		if (row === undefined && !('row' in $$props || $$self.$$.bound[$$self.$$.props['row']])) {
    			console.warn("<ColumnChart> was created without expected prop 'row'");
    		}

    		if (dataCharts === undefined && !('dataCharts' in $$props || $$self.$$.bound[$$self.$$.props['dataCharts']])) {
    			console.warn("<ColumnChart> was created without expected prop 'dataCharts'");
    		}

    		if (dataText === undefined && !('dataText' in $$props || $$self.$$.bound[$$self.$$.props['dataText']])) {
    			console.warn("<ColumnChart> was created without expected prop 'dataText'");
    		}
    	});

    	const writable_props = ['type', 'id', 'row', 'dataCharts', 'dataText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColumnChart> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(4, el);
    		});
    	}

    	function div1_elementresize_handler() {
    		chartWidth = this.clientWidth;
    		$$invalidate(2, chartWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(13, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(14, dataCharts = $$props.dataCharts);
    		if ('dataText' in $$props) $$invalidate(15, dataText = $$props.dataText);
    	};

    	$$self.$capture_state = () => ({
    		each,
    		scaleLinear: linear,
    		type,
    		id,
    		row,
    		dataCharts,
    		dataText,
    		max,
    		min,
    		range,
    		chartWidth,
    		height,
    		el,
    		formatDate: formatDate$1,
    		formattedUpdated,
    		formattedEndDate,
    		formattedStartDate,
    		yScale,
    		thisChart,
    		barWidth,
    		key
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(13, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(14, dataCharts = $$props.dataCharts);
    		if ('dataText' in $$props) $$invalidate(15, dataText = $$props.dataText);
    		if ('max' in $$props) $$invalidate(19, max = $$props.max);
    		if ('min' in $$props) $$invalidate(10, min = $$props.min);
    		if ('range' in $$props) $$invalidate(11, range = $$props.range);
    		if ('chartWidth' in $$props) $$invalidate(2, chartWidth = $$props.chartWidth);
    		if ('height' in $$props) $$invalidate(12, height = $$props.height);
    		if ('el' in $$props) $$invalidate(4, el = $$props.el);
    		if ('formattedUpdated' in $$props) $$invalidate(5, formattedUpdated = $$props.formattedUpdated);
    		if ('formattedEndDate' in $$props) $$invalidate(6, formattedEndDate = $$props.formattedEndDate);
    		if ('formattedStartDate' in $$props) $$invalidate(7, formattedStartDate = $$props.formattedStartDate);
    		if ('yScale' in $$props) $$invalidate(8, yScale = $$props.yScale);
    		if ('thisChart' in $$props) $$invalidate(3, thisChart = $$props.thisChart);
    		if ('barWidth' in $$props) $$invalidate(9, barWidth = $$props.barWidth);
    		if ('key' in $$props) $$invalidate(16, key = $$props.key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(16, key = row.measure);
    		}

    		if ($$self.$$.dirty & /*dataCharts, key*/ 81920) {
    			// console.log("row", row);
    			// console.log("key", key);
    			// console.log("dataCharts", dataCharts);
    			$$invalidate(3, thisChart = dataCharts.map(e => e[key]).filter(e => e));
    		}

    		if ($$self.$$.dirty & /*chartWidth, thisChart*/ 12) {
    			$$invalidate(9, barWidth = 9 * ((chartWidth - 104) / ((thisChart.length - 1) * 10 + 9)));
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(7, formattedStartDate = formatDate$1(row.startdate));
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(6, formattedEndDate = formatDate$1(row.enddate));
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(5, formattedUpdated = formatDate$1(row.update));
    		}
    	};

    	$$invalidate(8, yScale = linear().domain([min, max]).range([0, height]));

    	return [
    		id,
    		row,
    		chartWidth,
    		thisChart,
    		el,
    		formattedUpdated,
    		formattedEndDate,
    		formattedStartDate,
    		yScale,
    		barWidth,
    		min,
    		range,
    		height,
    		type,
    		dataCharts,
    		dataText,
    		key,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class ColumnChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			type: 13,
    			id: 0,
    			row: 1,
    			dataCharts: 14,
    			dataText: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColumnChart",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get type() {
    		throw new Error("<ColumnChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ColumnChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ColumnChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ColumnChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<ColumnChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<ColumnChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataCharts() {
    		throw new Error("<ColumnChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataCharts(value) {
    		throw new Error("<ColumnChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataText() {
    		throw new Error("<ColumnChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataText(value) {
    		throw new Error("<ColumnChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\StaticNumber.svelte generated by Svelte v3.59.2 */
    const file$3 = "src\\StaticNumber.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = /*row*/ ctx[1].headingtext + "";
    	let t0;
    	let t1;
    	let svg;
    	let rect;
    	let rect_width_value;
    	let text0;
    	let t2;
    	let t3;
    	let text0_x_value;
    	let text1;
    	let t4_value = /*row*/ ctx[1].enddate.replace("Sep-", "Sept ").replace("Jun-", "June ").replace("Jul-", "July ").replace("-", " ") + "";
    	let t4;
    	let text1_x_value;
    	let text1_font_size_value;
    	let t5;
    	let p1;
    	let t6;
    	let t7_value = /*row*/ ctx[1].update.replace(/^0/, "").replace("Sep-", "Sept ").replace("Jun-", "June ").replace("Jul-", "July ").replace("-", " ").replace(/\b(\d{2})$/, "20$1") + "";
    	let t7;
    	let div1_resize_listener;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			text0 = svg_element("text");
    			t2 = text(/*formattedValue*/ ctx[5]);
    			t3 = text(/*suffix*/ ctx[4]);
    			text1 = svg_element("text");
    			t4 = text(t4_value);
    			t5 = space();
    			p1 = element("p");
    			t6 = text("Updated: ");
    			t7 = text(t7_value);
    			attr_dev(p0, "class", "headingText");
    			add_location(p0, file$3, 50, 8, 1429);
    			attr_dev(div0, "class", "chartContainer");
    			add_location(div0, file$3, 49, 4, 1391);
    			attr_dev(rect, "class", "chartBackground");
    			attr_dev(rect, "x", "35");
    			attr_dev(rect, "width", rect_width_value = /*chartWidth*/ ctx[2] - 104);
    			attr_dev(rect, "height", "110");
    			add_location(rect, file$3, 55, 8, 1595);
    			attr_dev(text0, "class", "bigNo");
    			attr_dev(text0, "x", text0_x_value = /*chartWidth*/ ctx[2] / 2 - 12);
    			attr_dev(text0, "y", /*height*/ ctx[6] / 2 + 6);
    			add_location(text0, file$3, 63, 8, 1792);
    			attr_dev(text1, "class", "bigDate");
    			attr_dev(text1, "x", text1_x_value = /*chartWidth*/ ctx[2] / 2 - 12);
    			attr_dev(text1, "y", /*height*/ ctx[6] / 0.95);
    			attr_dev(text1, "font-size", text1_font_size_value = /*chartWidth*/ ctx[2] < 290 ? "20px" : "22px");
    			add_location(text1, file$3, 66, 8, 1920);
    			attr_dev(svg, "class", "chartDrawing");
    			attr_dev(svg, "width", "281");
    			add_location(svg, file$3, 53, 4, 1493);
    			attr_dev(p1, "class", "updated");
    			add_location(p1, file$3, 78, 4, 2310);
    			attr_dev(div1, "class", "graphic");
    			attr_dev(div1, "id", /*id*/ ctx[0]);
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[13].call(div1));
    			add_location(div1, file$3, 47, 0, 1281);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, svg);
    			append_dev(svg, rect);
    			append_dev(svg, text0);
    			append_dev(text0, t2);
    			append_dev(text0, t3);
    			append_dev(svg, text1);
    			append_dev(text1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			/*div1_binding*/ ctx[12](div1);
    			div1_resize_listener = add_iframe_resize_listener(div1, /*div1_elementresize_handler*/ ctx[13].bind(div1));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*row*/ 2 && t0_value !== (t0_value = /*row*/ ctx[1].headingtext + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*chartWidth*/ 4 && rect_width_value !== (rect_width_value = /*chartWidth*/ ctx[2] - 104)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*formattedValue*/ 32) set_data_dev(t2, /*formattedValue*/ ctx[5]);
    			if (dirty & /*suffix*/ 16) set_data_dev(t3, /*suffix*/ ctx[4]);

    			if (dirty & /*chartWidth*/ 4 && text0_x_value !== (text0_x_value = /*chartWidth*/ ctx[2] / 2 - 12)) {
    				attr_dev(text0, "x", text0_x_value);
    			}

    			if (dirty & /*row*/ 2 && t4_value !== (t4_value = /*row*/ ctx[1].enddate.replace("Sep-", "Sept ").replace("Jun-", "June ").replace("Jul-", "July ").replace("-", " ") + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*chartWidth*/ 4 && text1_x_value !== (text1_x_value = /*chartWidth*/ ctx[2] / 2 - 12)) {
    				attr_dev(text1, "x", text1_x_value);
    			}

    			if (dirty & /*chartWidth*/ 4 && text1_font_size_value !== (text1_font_size_value = /*chartWidth*/ ctx[2] < 290 ? "20px" : "22px")) {
    				attr_dev(text1, "font-size", text1_font_size_value);
    			}

    			if (dirty & /*row*/ 2 && t7_value !== (t7_value = /*row*/ ctx[1].update.replace(/^0/, "").replace("Sep-", "Sept ").replace("Jun-", "June ").replace("Jul-", "July ").replace("-", " ").replace(/\b(\d{2})$/, "20$1") + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*id*/ 1) {
    				attr_dev(div1, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[12](null);
    			div1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let key;
    	let thisChart;
    	let formattedValue;
    	let suffix;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StaticNumber', slots, []);
    	let { type = "number" } = $$props;
    	let { id } = $$props;
    	let { row } = $$props;
    	let { dataCharts } = $$props;
    	let { dataText } = $$props;

    	//   let max = row.yaxisend;
    	//   let min = row.yaxisstart;
    	//   let range = max - min;
    	// console.log(thisChart, row.enddate);
    	let chartWidth = 300, height = 110;

    	let el;

    	// UK locale so "$" in a format string renders as £ rather than $
    	const ukLocale = formatLocale({
    		decimal: ".",
    		thousands: ",",
    		grouping: [3],
    		currency: ["£", ""]
    	});

    	const ukFormat = ukLocale.format("$,.0f");

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<StaticNumber> was created without expected prop 'id'");
    		}

    		if (row === undefined && !('row' in $$props || $$self.$$.bound[$$self.$$.props['row']])) {
    			console.warn("<StaticNumber> was created without expected prop 'row'");
    		}

    		if (dataCharts === undefined && !('dataCharts' in $$props || $$self.$$.bound[$$self.$$.props['dataCharts']])) {
    			console.warn("<StaticNumber> was created without expected prop 'dataCharts'");
    		}

    		if (dataText === undefined && !('dataText' in $$props || $$self.$$.bound[$$self.$$.props['dataText']])) {
    			console.warn("<StaticNumber> was created without expected prop 'dataText'");
    		}
    	});

    	const writable_props = ['type', 'id', 'row', 'dataCharts', 'dataText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StaticNumber> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(3, el);
    		});
    	}

    	function div1_elementresize_handler() {
    		chartWidth = this.clientWidth;
    		$$invalidate(2, chartWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(7, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(8, dataCharts = $$props.dataCharts);
    		if ('dataText' in $$props) $$invalidate(9, dataText = $$props.dataText);
    	};

    	$$self.$capture_state = () => ({
    		each,
    		formatLocale,
    		type,
    		id,
    		row,
    		dataCharts,
    		dataText,
    		chartWidth,
    		height,
    		el,
    		ukLocale,
    		ukFormat,
    		suffix,
    		thisChart,
    		formattedValue,
    		key
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(7, type = $$props.type);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('row' in $$props) $$invalidate(1, row = $$props.row);
    		if ('dataCharts' in $$props) $$invalidate(8, dataCharts = $$props.dataCharts);
    		if ('dataText' in $$props) $$invalidate(9, dataText = $$props.dataText);
    		if ('chartWidth' in $$props) $$invalidate(2, chartWidth = $$props.chartWidth);
    		if ('height' in $$props) $$invalidate(6, height = $$props.height);
    		if ('el' in $$props) $$invalidate(3, el = $$props.el);
    		if ('suffix' in $$props) $$invalidate(4, suffix = $$props.suffix);
    		if ('thisChart' in $$props) $$invalidate(10, thisChart = $$props.thisChart);
    		if ('formattedValue' in $$props) $$invalidate(5, formattedValue = $$props.formattedValue);
    		if ('key' in $$props) $$invalidate(11, key = $$props.key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(11, key = row.measure);
    		}

    		if ($$self.$$.dirty & /*dataCharts, key*/ 2304) {
    			// $: console.log("row", row);
    			// $: console.log("key", key);
    			// console.log("dataCharts", dataCharts);
    			$$invalidate(10, thisChart = dataCharts.map(e => e[key]).filter(e => e));
    		}

    		if ($$self.$$.dirty & /*row, thisChart*/ 1026) {
    			$$invalidate(5, formattedValue = (row.directLabelUnit?.includes("£"))
    			? ukFormat(thisChart)
    			: (Math.round(thisChart * 10) / 10).toFixed(1));
    		}

    		if ($$self.$$.dirty & /*row*/ 2) {
    			$$invalidate(4, suffix = (row.directLabelUnit?.includes("£"))
    			? ""
    			: (row.directLabelUnit?.includes("%"))
    				? row.directLabelUnit
    				: " " + row.directLabelUnit);
    		}
    	};

    	return [
    		id,
    		row,
    		chartWidth,
    		el,
    		suffix,
    		formattedValue,
    		height,
    		type,
    		dataCharts,
    		dataText,
    		thisChart,
    		key,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class StaticNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			type: 7,
    			id: 0,
    			row: 1,
    			dataCharts: 8,
    			dataText: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StaticNumber",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get type() {
    		throw new Error("<StaticNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<StaticNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<StaticNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<StaticNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<StaticNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<StaticNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataCharts() {
    		throw new Error("<StaticNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataCharts(value) {
    		throw new Error("<StaticNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataText() {
    		throw new Error("<StaticNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataText(value) {
    		throw new Error("<StaticNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var pym_v1 = {exports: {}};

    /*! pym.js - v1.3.2 - 2018-02-13 */

    (function (module) {
    	/*
    	* Pym.js is library that resizes an iframe based on the width of the parent and the resulting height of the child.
    	* Check out the docs at http://blog.apps.npr.org/pym.js/ or the readme at README.md for usage.
    	*/

    	/** @module pym */
    	(function(factory) {
    	    if (module.exports) {
    	        module.exports = factory();
    	    } else {
    	        window.pym = factory.call(this);
    	    }
    	})(function() {
    	    var MESSAGE_DELIMITER = 'xPYMx';

    	    var lib = {};

    	    /**
    	    * Create and dispatch a custom pym event
    	    *
    	    * @method _raiseCustomEvent
    	    * @inner
    	    *
    	    * @param {String} eventName
    	    */
    	   var _raiseCustomEvent = function(eventName) {
    	     var event = document.createEvent('Event');
    	     event.initEvent('pym:' + eventName, true, true);
    	     document.dispatchEvent(event);
    	   };

    	    /**
    	    * Generic function for parsing URL params.
    	    * Via http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    	    *
    	    * @method _getParameterByName
    	    * @inner
    	    *
    	    * @param {String} name The name of the paramter to get from the URL.
    	    */
    	    var _getParameterByName = function(name) {
    	        var regex = new RegExp("[\\?&]" + name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]') + '=([^&#]*)');
    	        var results = regex.exec(location.search);

    	        if (results === null) {
    	            return '';
    	        }

    	        return decodeURIComponent(results[1].replace(/\+/g, " "));
    	    };

    	    /**
    	     * Check the message to make sure it comes from an acceptable xdomain.
    	     * Defaults to '*' but can be overriden in config.
    	     *
    	     * @method _isSafeMessage
    	     * @inner
    	     *
    	     * @param {Event} e The message event.
    	     * @param {Object} settings Configuration.
    	     */
    	    var _isSafeMessage = function(e, settings) {
    	        if (settings.xdomain !== '*') {
    	            // If origin doesn't match our xdomain, return.
    	            if (!e.origin.match(new RegExp(settings.xdomain + '$'))) { return; }
    	        }

    	        // Ignore events that do not carry string data #151
    	        if (typeof e.data !== 'string') { return; }

    	        return true;
    	    };

    	    var _isSafeUrl = function(url) {
    	        // Adapted from angular 2 url sanitizer
    	        var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/gi;
    	        if (!url.match(SAFE_URL_PATTERN)) { return; }
    	        
    	        return true;
    	    };

    	    /**
    	     * Construct a message to send between frames.
    	     *
    	     * NB: We use string-building here because JSON message passing is
    	     * not supported in all browsers.
    	     *
    	     * @method _makeMessage
    	     * @inner
    	     *
    	     * @param {String} id The unique id of the message recipient.
    	     * @param {String} messageType The type of message to send.
    	     * @param {String} message The message to send.
    	     */
    	    var _makeMessage = function(id, messageType, message) {
    	        var bits = ['pym', id, messageType, message];

    	        return bits.join(MESSAGE_DELIMITER);
    	    };

    	    /**
    	     * Construct a regex to validate and parse messages.
    	     *
    	     * @method _makeMessageRegex
    	     * @inner
    	     *
    	     * @param {String} id The unique id of the message recipient.
    	     */
    	    var _makeMessageRegex = function(id) {
    	        var bits = ['pym', id, '(\\S+)', '(.*)'];

    	        return new RegExp('^' + bits.join(MESSAGE_DELIMITER) + '$');
    	    };

    	    /**
    	    * Underscore implementation of getNow
    	    *
    	    * @method _getNow
    	    * @inner
    	    *
    	    */
    	    var _getNow = Date.now || function() {
    	        return new Date().getTime();
    	    };

    	    /**
    	    * Underscore implementation of throttle
    	    *
    	    * @method _throttle
    	    * @inner
    	    *
    	    * @param {function} func Throttled function
    	    * @param {number} wait Throttle wait time
    	    * @param {object} options Throttle settings
    	    */

    	    var _throttle = function(func, wait, options) {
    	        var context, args, result;
    	        var timeout = null;
    	        var previous = 0;
    	        if (!options) {options = {};}
    	        var later = function() {
    	            previous = options.leading === false ? 0 : _getNow();
    	            timeout = null;
    	            result = func.apply(context, args);
    	            if (!timeout) {context = args = null;}
    	        };
    	        return function() {
    	            var now = _getNow();
    	            if (!previous && options.leading === false) {previous = now;}
    	            var remaining = wait - (now - previous);
    	            context = this;
    	            args = arguments;
    	            if (remaining <= 0 || remaining > wait) {
    	                if (timeout) {
    	                    clearTimeout(timeout);
    	                    timeout = null;
    	                }
    	                previous = now;
    	                result = func.apply(context, args);
    	                if (!timeout) {context = args = null;}
    	            } else if (!timeout && options.trailing !== false) {
    	                timeout = setTimeout(later, remaining);
    	            }
    	            return result;
    	        };
    	    };

    	    /**
    	     * Clean autoInit Instances: those that point to contentless iframes
    	     * @method _cleanAutoInitInstances
    	     * @inner
    	     */
    	    var _cleanAutoInitInstances = function() {
    	        var length = lib.autoInitInstances.length;

    	        // Loop backwards to avoid index issues
    	        for (var idx = length - 1; idx >= 0; idx--) {
    	            var instance = lib.autoInitInstances[idx];
    	            // If instance has been removed or is contentless then remove it
    	            if (instance.el.getElementsByTagName('iframe').length &&
    	                instance.el.getElementsByTagName('iframe')[0].contentWindow) {
    	                continue;
    	            }
    	            else {
    	                // Remove the reference to the removed or orphan instance
    	                lib.autoInitInstances.splice(idx,1);
    	            }
    	        }
    	    };

    	    /**
    	     * Store auto initialized Pym instances for further reference
    	     * @name module:pym#autoInitInstances
    	     * @type Array
    	     * @default []
    	     */
    	    lib.autoInitInstances = [];

    	    /**
    	     * Initialize Pym for elements on page that have data-pym attributes.
    	     * Expose autoinit in case we need to call it from the outside
    	     * @instance
    	     * @method autoInit
    	     * @param {Boolean} doNotRaiseEvents flag to avoid sending custom events
    	     */
    	    lib.autoInit = function(doNotRaiseEvents) {
    	        var elements = document.querySelectorAll('[data-pym-src]:not([data-pym-auto-initialized])');
    	        var length = elements.length;

    	        // Clean stored instances in case needed
    	        _cleanAutoInitInstances();
    	        for (var idx = 0; idx < length; ++idx) {
    	            var element = elements[idx];
    	            /*
    	            * Mark automatically-initialized elements so they are not
    	            * re-initialized if the user includes pym.js more than once in the
    	            * same document.
    	            */
    	            element.setAttribute('data-pym-auto-initialized', '');

    	            // Ensure elements have an id
    	            if (element.id === '') {
    	                element.id = 'pym-' + idx + "-" + Math.random().toString(36).substr(2,5);
    	            }

    	            var src = element.getAttribute('data-pym-src');

    	            // List of data attributes to configure the component
    	            // structure: {'attribute name': 'type'}
    	            var settings = {'xdomain': 'string', 'title': 'string', 'name': 'string', 'id': 'string',
    	                            'sandbox': 'string', 'allowfullscreen': 'boolean',
    	                            'parenturlparam': 'string', 'parenturlvalue': 'string',
    	                            'optionalparams': 'boolean', 'trackscroll': 'boolean',
    	                            'scrollwait': 'number'};

    	            var config = {};

    	            for (var attribute in settings) {
    	                // via https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute#Notes
    	               if (element.getAttribute('data-pym-'+attribute) !== null) {
    	                  switch (settings[attribute]) {
    	                    case 'boolean':
    	                       config[attribute] = !(element.getAttribute('data-pym-'+attribute) === 'false'); // jshint ignore:line
    	                       break;
    	                    case 'string':
    	                       config[attribute] = element.getAttribute('data-pym-'+attribute);
    	                       break;
    	                    case 'number':
    	                        var n = Number(element.getAttribute('data-pym-'+attribute));
    	                        if (!isNaN(n)) {
    	                            config[attribute] = n;
    	                        }
    	                        break;
    	                    default:
    	                       console.err('unrecognized attribute type');
    	                  }
    	               }
    	            }

    	            // Store references to autoinitialized pym instances
    	            var parent = new lib.Parent(element.id, src, config);
    	            lib.autoInitInstances.push(parent);
    	        }

    	        // Fire customEvent
    	        if (!doNotRaiseEvents) {
    	            _raiseCustomEvent("pym-initialized");
    	        }
    	        // Return stored autoinitalized pym instances
    	        return lib.autoInitInstances;
    	    };

    	    /**
    	     * The Parent half of a response iframe.
    	     *
    	     * @memberof module:pym
    	     * @class Parent
    	     * @param {String} id The id of the div into which the iframe will be rendered. sets {@link module:pym.Parent~id}
    	     * @param {String} url The url of the iframe source. sets {@link module:pym.Parent~url}
    	     * @param {Object} [config] Configuration for the parent instance. sets {@link module:pym.Parent~settings}
    	     * @param {string} [config.xdomain='*'] - xdomain to validate messages received
    	     * @param {string} [config.title] - if passed it will be assigned to the iframe title attribute
    	     * @param {string} [config.name] - if passed it will be assigned to the iframe name attribute
    	     * @param {string} [config.id] - if passed it will be assigned to the iframe id attribute
    	     * @param {boolean} [config.allowfullscreen] - if passed and different than false it will be assigned to the iframe allowfullscreen attribute
    	     * @param {string} [config.sandbox] - if passed it will be assigned to the iframe sandbox attribute (we do not validate the syntax so be careful!!)
    	     * @param {string} [config.parenturlparam] - if passed it will be override the default parentUrl query string parameter name passed to the iframe src
    	     * @param {string} [config.parenturlvalue] - if passed it will be override the default parentUrl query string parameter value passed to the iframe src
    	     * @param {string} [config.optionalparams] - if passed and different than false it will strip the querystring params parentUrl and parentTitle passed to the iframe src
    	     * @param {boolean} [config.trackscroll] - if passed it will activate scroll tracking on the parent
    	     * @param {number} [config.scrollwait] - if passed it will set the throttle wait in order to fire scroll messaging. Defaults to 100 ms.
    	     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe iFrame}
    	     */
    	    lib.Parent = function(id, url, config) {
    	        /**
    	         * The id of the container element
    	         *
    	         * @memberof module:pym.Parent
    	         * @member {string} id
    	         * @inner
    	         */
    	        this.id = id;
    	        /**
    	         * The url that will be set as the iframe's src
    	         *
    	         * @memberof module:pym.Parent
    	         * @member {String} url
    	         * @inner
    	         */
    	        this.url = url;

    	        /**
    	         * The container DOM object
    	         *
    	         * @memberof module:pym.Parent
    	         * @member {HTMLElement} el
    	         * @inner
    	         */
    	        this.el = document.getElementById(id);
    	        /**
    	         * The contained child iframe
    	         *
    	         * @memberof module:pym.Parent
    	         * @member {HTMLElement} iframe
    	         * @inner
    	         * @default null
    	         */
    	        this.iframe = null;
    	        /**
    	         * The parent instance settings, updated by the values passed in the config object
    	         *
    	         * @memberof module:pym.Parent
    	         * @member {Object} settings
    	         * @inner
    	         */
    	        this.settings = {
    	            xdomain: '*',
    	            optionalparams: true,
    	            parenturlparam: 'parentUrl',
    	            parenturlvalue: window.location.href,
    	            trackscroll: false,
    	            scrollwait: 100,
    	        };
    	        /**
    	         * RegularExpression to validate the received messages
    	         *
    	         * @memberof module:pym.Parent
    	         * @member {String} messageRegex
    	         * @inner
    	         */
    	        this.messageRegex = _makeMessageRegex(this.id);
    	        /**
    	         * Stores the registered messageHandlers for each messageType
    	         *
    	         * @memberof module:pym.Parent
    	         * @member {Object} messageHandlers
    	         * @inner
    	         */
    	        this.messageHandlers = {};

    	        // ensure a config object
    	        config = (config || {});

    	        /**
    	         * Construct the iframe.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _constructIframe
    	         * @inner
    	         */
    	        this._constructIframe = function() {
    	            // Calculate the width of this element.
    	            var width = this.el.offsetWidth.toString();

    	            // Create an iframe element attached to the document.
    	            this.iframe = document.createElement('iframe');

    	            // Save fragment id
    	            var hash = '';
    	            var hashIndex = this.url.indexOf('#');

    	            if (hashIndex > -1) {
    	                hash = this.url.substring(hashIndex, this.url.length);
    	                this.url = this.url.substring(0, hashIndex);
    	            }

    	            // If the URL contains querystring bits, use them.
    	            // Otherwise, just create a set of valid params.
    	            if (this.url.indexOf('?') < 0) {
    	                this.url += '?';
    	            } else {
    	                this.url += '&';
    	            }

    	            // Append the initial width as a querystring parameter
    	            // and optional params if configured to do so
    	            this.iframe.src = this.url + 'initialWidth=' + width +
    	                                         '&childId=' + this.id;

    	            if (this.settings.optionalparams) {
    	                this.iframe.src += '&parentTitle=' + encodeURIComponent(document.title);
    	                this.iframe.src += '&'+ this.settings.parenturlparam + '=' + encodeURIComponent(this.settings.parenturlvalue);
    	            }
    	            this.iframe.src +=hash;

    	            // Set some attributes to this proto-iframe.
    	            this.iframe.setAttribute('width', '100%');
    	            this.iframe.setAttribute('scrolling', 'no');
    	            this.iframe.setAttribute('marginheight', '0');
    	            this.iframe.setAttribute('frameborder', '0');

    	            if (this.settings.title) {
    	                this.iframe.setAttribute('title', this.settings.title);
    	            }

    	            if (this.settings.allowfullscreen !== undefined && this.settings.allowfullscreen !== false) {
    	                this.iframe.setAttribute('allowfullscreen','');
    	            }

    	            if (this.settings.sandbox !== undefined && typeof this.settings.sandbox === 'string') {
    	                this.iframe.setAttribute('sandbox', this.settings.sandbox);
    	            }

    	            if (this.settings.id) {
    	                if (!document.getElementById(this.settings.id)) {
    	                    this.iframe.setAttribute('id', this.settings.id);
    	                }
    	            }

    	            if (this.settings.name) {
    	                this.iframe.setAttribute('name', this.settings.name);
    	            }

    	            // Replace the child content if needed
    	            // (some CMSs might strip out empty elements)
    	            while(this.el.firstChild) { this.el.removeChild(this.el.firstChild); }
    	            // Append the iframe to our element.
    	            this.el.appendChild(this.iframe);

    	            // Add an event listener that will handle redrawing the child on resize.
    	            window.addEventListener('resize', this._onResize);

    	            // Add an event listener that will send the child the viewport.
    	            if (this.settings.trackscroll) {
    	                window.addEventListener('scroll', this._throttleOnScroll);
    	            }
    	        };

    	        /**
    	         * Send width on resize.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _onResize
    	         * @inner
    	         */
    	        this._onResize = function() {
    	            this.sendWidth();
    	            if (this.settings.trackscroll) {
    	                this.sendViewportAndIFramePosition();
    	            }
    	        }.bind(this);

    	        /**
    	         * Send viewport and iframe info on scroll.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _onScroll
    	         * @inner
    	         */
    	        this._onScroll = function() {
    	            this.sendViewportAndIFramePosition();
    	        }.bind(this);

    	        /**
    	         * Fire all event handlers for a given message type.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _fire
    	         * @inner
    	         *
    	         * @param {String} messageType The type of message.
    	         * @param {String} message The message data.
    	         */
    	        this._fire = function(messageType, message) {
    	            if (messageType in this.messageHandlers) {
    	                for (var i = 0; i < this.messageHandlers[messageType].length; i++) {
    	                   this.messageHandlers[messageType][i].call(this, message);
    	                }
    	            }
    	        };

    	        /**
    	         * Remove this parent from the page and unbind it's event handlers.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method remove
    	         * @instance
    	         */
    	        this.remove = function() {
    	            window.removeEventListener('message', this._processMessage);
    	            window.removeEventListener('resize', this._onResize);

    	            this.el.removeChild(this.iframe);
    	            // _cleanAutoInitInstances in case this parent was autoInitialized
    	            _cleanAutoInitInstances();
    	        };

    	        /**
    	         * Process a new message from the child.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _processMessage
    	         * @inner
    	         *
    	         * @param {Event} e A message event.
    	         */
    	        this._processMessage = function(e) {
    	            // First, punt if this isn't from an acceptable xdomain.
    	            if (!_isSafeMessage(e, this.settings)) {
    	                return;
    	            }

    	            // Discard object messages, we only care about strings
    	            if (typeof e.data !== 'string') {
    	                return;
    	            }

    	            // Grab the message from the child and parse it.
    	            var match = e.data.match(this.messageRegex);

    	            // If there's no match or too many matches in the message, punt.
    	            if (!match || match.length !== 3) {
    	                return false;
    	            }

    	            var messageType = match[1];
    	            var message = match[2];

    	            this._fire(messageType, message);
    	        }.bind(this);

    	        /**
    	         * Resize iframe in response to new height message from child.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _onHeightMessage
    	         * @inner
    	         *
    	         * @param {String} message The new height.
    	         */
    	        this._onHeightMessage = function(message) {
    	            /*
    	             * Handle parent height message from child.
    	             */
    	            var height = parseInt(message);

    	            this.iframe.setAttribute('height', height + 'px');
    	        };

    	        /**
    	         * Navigate parent to a new url.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _onNavigateToMessage
    	         * @inner
    	         *
    	         * @param {String} message The url to navigate to.
    	         */
    	        this._onNavigateToMessage = function(message) {
    	            /*
    	             * Handle parent scroll message from child.
    	             */
    	             if (!_isSafeUrl(message)) {return;}
    	            document.location.href = message;
    	        };

    	        /**
    	         * Scroll parent to a given child position.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _onScrollToChildPosMessage
    	         * @inner
    	         *
    	         * @param {String} message The offset inside the child page.
    	         */
    	        this._onScrollToChildPosMessage = function(message) {
    	            // Get the child container position using getBoundingClientRect + pageYOffset
    	            // via https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    	            var iframePos = document.getElementById(this.id).getBoundingClientRect().top + window.pageYOffset;

    	            var totalOffset = iframePos + parseInt(message);
    	            window.scrollTo(0, totalOffset);
    	        };

    	        /**
    	         * Bind a callback to a given messageType from the child.
    	         *
    	         * Reserved message names are: "height", "scrollTo" and "navigateTo".
    	         *
    	         * @memberof module:pym.Parent
    	         * @method onMessage
    	         * @instance
    	         *
    	         * @param {String} messageType The type of message being listened for.
    	         * @param {module:pym.Parent~onMessageCallback} callback The callback to invoke when a message of the given type is received.
    	         */
    	        this.onMessage = function(messageType, callback) {
    	            if (!(messageType in this.messageHandlers)) {
    	                this.messageHandlers[messageType] = [];
    	            }

    	            this.messageHandlers[messageType].push(callback);
    	        };

    	        /**
    	         * @callback module:pym.Parent~onMessageCallback
    	         * @param {String} message The message data.
    	         */

    	        /**
    	         * Send a message to the the child.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method sendMessage
    	         * @instance
    	         *
    	         * @param {String} messageType The type of message to send.
    	         * @param {String} message The message data to send.
    	         */
    	        this.sendMessage = function(messageType, message) {
    	            // When used alongside with pjax some references are lost
    	            if (this.el.getElementsByTagName('iframe').length) {
    	                if (this.el.getElementsByTagName('iframe')[0].contentWindow) {
    	                    this.el.getElementsByTagName('iframe')[0].contentWindow
    	                        .postMessage(_makeMessage(this.id, messageType, message), '*');
    	                }
    	                else {
    	                    // Contentless child detected remove listeners and iframe
    	                    this.remove();
    	                }
    	            }
    	        };

    	        /**
    	         * Transmit the current iframe width to the child.
    	         *
    	         * You shouldn't need to call this directly.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method sendWidth
    	         * @instance
    	         */
    	        this.sendWidth = function() {
    	            var width = this.el.offsetWidth.toString();
    	            this.sendMessage('width', width);
    	        };

    	        /**
    	         * Transmit the current viewport and iframe position to the child.
    	         * Sends viewport width, viewport height
    	         * and iframe bounding rect top-left-bottom-right
    	         * all separated by spaces
    	         *
    	         * You shouldn't need to call this directly.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method sendViewportAndIFramePosition
    	         * @instance
    	         */
    	        this.sendViewportAndIFramePosition = function() {
    	            var iframeRect = this.iframe.getBoundingClientRect();
    	            var vWidth   = window.innerWidth || document.documentElement.clientWidth;
    	            var vHeight  = window.innerHeight || document.documentElement.clientHeight;
    	            var payload = vWidth + ' ' + vHeight;
    	            payload += ' ' + iframeRect.top + ' ' + iframeRect.left;
    	            payload += ' ' + iframeRect.bottom + ' ' + iframeRect.right;
    	            this.sendMessage('viewport-iframe-position', payload);
    	        };

    	        // Add any overrides to settings coming from config.
    	        for (var key in config) {
    	            this.settings[key] = config[key];
    	        }

    	        /**
    	         * Throttled scroll function.
    	         *
    	         * @memberof module:pym.Parent
    	         * @method _throttleOnScroll
    	         * @inner
    	         */
    	        this._throttleOnScroll = _throttle(this._onScroll.bind(this), this.settings.scrollwait);

    	        // Bind required message handlers
    	        this.onMessage('height', this._onHeightMessage);
    	        this.onMessage('navigateTo', this._onNavigateToMessage);
    	        this.onMessage('scrollToChildPos', this._onScrollToChildPosMessage);
    	        this.onMessage('parentPositionInfo', this.sendViewportAndIFramePosition);

    	        // Add a listener for processing messages from the child.
    	        window.addEventListener('message', this._processMessage, false);

    	        // Construct the iframe in the container element.
    	        this._constructIframe();

    	        return this;
    	    };

    	    /**
    	     * The Child half of a responsive iframe.
    	     *
    	     * @memberof module:pym
    	     * @class Child
    	     * @param {Object} [config] Configuration for the child instance. sets {@link module:pym.Child~settings}
    	     * @param {function} [config.renderCallback=null] Callback invoked after receiving a resize event from the parent, sets {@link module:pym.Child#settings.renderCallback}
    	     * @param {string} [config.xdomain='*'] - xdomain to validate messages received
    	     * @param {number} [config.polling=0] - polling frequency in milliseconds to send height to parent
    	     * @param {number} [config.id] - parent container id used when navigating the child iframe to a new page but we want to keep it responsive.
    	     * @param {string} [config.parenturlparam] - if passed it will be override the default parentUrl query string parameter name expected on the iframe src
    	     */
    	    lib.Child = function(config) {
    	        /**
    	         * The initial width of the parent page
    	         *
    	         * @memberof module:pym.Child
    	         * @member {string} parentWidth
    	         * @inner
    	         */
    	        this.parentWidth = null;
    	        /**
    	         * The id of the parent container
    	         *
    	         * @memberof module:pym.Child
    	         * @member {String} id
    	         * @inner
    	         */
    	        this.id = null;
    	        /**
    	         * The title of the parent page from document.title.
    	         *
    	         * @memberof module:pym.Child
    	         * @member {String} parentTitle
    	         * @inner
    	         */
    	        this.parentTitle = null;
    	        /**
    	         * The URL of the parent page from window.location.href.
    	         *
    	         * @memberof module:pym.Child
    	         * @member {String} parentUrl
    	         * @inner
    	         */
    	        this.parentUrl = null;
    	        /**
    	         * The settings for the child instance. Can be overriden by passing a config object to the child constructor
    	         * i.e.: var pymChild = new pym.Child({renderCallback: render, xdomain: "\\*\.npr\.org"})
    	         *
    	         * @memberof module:pym.Child.settings
    	         * @member {Object} settings - default settings for the child instance
    	         * @inner
    	         */
    	        this.settings = {
    	            renderCallback: null,
    	            xdomain: '*',
    	            polling: 0,
    	            parenturlparam: 'parentUrl'
    	        };

    	        /**
    	         * The timerId in order to be able to stop when polling is enabled
    	         *
    	         * @memberof module:pym.Child
    	         * @member {String} timerId
    	         * @inner
    	         */
    	        this.timerId = null;
    	        /**
    	         * RegularExpression to validate the received messages
    	         *
    	         * @memberof module:pym.Child
    	         * @member {String} messageRegex
    	         * @inner
    	         */
    	        this.messageRegex = null;
    	        /**
    	         * Stores the registered messageHandlers for each messageType
    	         *
    	         * @memberof module:pym.Child
    	         * @member {Object} messageHandlers
    	         * @inner
    	         */
    	        this.messageHandlers = {};

    	        // Ensure a config object
    	        config = (config || {});

    	        /**
    	         * Bind a callback to a given messageType from the child.
    	         *
    	         * Reserved message names are: "width".
    	         *
    	         * @memberof module:pym.Child
    	         * @method onMessage
    	         * @instance
    	         *
    	         * @param {String} messageType The type of message being listened for.
    	         * @param {module:pym.Child~onMessageCallback} callback The callback to invoke when a message of the given type is received.
    	         */
    	        this.onMessage = function(messageType, callback) {

    	            if (!(messageType in this.messageHandlers)) {
    	                this.messageHandlers[messageType] = [];
    	            }

    	            this.messageHandlers[messageType].push(callback);
    	        };

    	        /**
    	         * @callback module:pym.Child~onMessageCallback
    	         * @param {String} message The message data.
    	         */


    	        /**
    	         * Fire all event handlers for a given message type.
    	         *
    	         * @memberof module:pym.Child
    	         * @method _fire
    	         * @inner
    	         *
    	         * @param {String} messageType The type of message.
    	         * @param {String} message The message data.
    	         */
    	        this._fire = function(messageType, message) {
    	            /*
    	             * Fire all event handlers for a given message type.
    	             */
    	            if (messageType in this.messageHandlers) {
    	                for (var i = 0; i < this.messageHandlers[messageType].length; i++) {
    	                   this.messageHandlers[messageType][i].call(this, message);
    	                }
    	            }
    	        };

    	        /**
    	         * Process a new message from the parent.
    	         *
    	         * @memberof module:pym.Child
    	         * @method _processMessage
    	         * @inner
    	         *
    	         * @param {Event} e A message event.
    	         */
    	        this._processMessage = function(e) {
    	            /*
    	            * Process a new message from parent frame.
    	            */
    	            // First, punt if this isn't from an acceptable xdomain.
    	            if (!_isSafeMessage(e, this.settings)) {
    	                return;
    	            }

    	            // Discard object messages, we only care about strings
    	            if (typeof e.data !== 'string') {
    	                return;
    	            }

    	            // Get the message from the parent.
    	            var match = e.data.match(this.messageRegex);

    	            // If there's no match or it's a bad format, punt.
    	            if (!match || match.length !== 3) { return; }

    	            var messageType = match[1];
    	            var message = match[2];

    	            this._fire(messageType, message);
    	        }.bind(this);

    	        /**
    	         * Resize iframe in response to new width message from parent.
    	         *
    	         * @memberof module:pym.Child
    	         * @method _onWidthMessage
    	         * @inner
    	         *
    	         * @param {String} message The new width.
    	         */
    	        this._onWidthMessage = function(message) {
    	            /*
    	             * Handle width message from the child.
    	             */
    	            var width = parseInt(message);

    	            // Change the width if it's different.
    	            if (width !== this.parentWidth) {
    	                this.parentWidth = width;

    	                // Call the callback function if it exists.
    	                if (this.settings.renderCallback) {
    	                    this.settings.renderCallback(width);
    	                }

    	                // Send the height back to the parent.
    	                this.sendHeight();
    	            }
    	        };

    	        /**
    	         * Send a message to the the Parent.
    	         *
    	         * @memberof module:pym.Child
    	         * @method sendMessage
    	         * @instance
    	         *
    	         * @param {String} messageType The type of message to send.
    	         * @param {String} message The message data to send.
    	         */
    	        this.sendMessage = function(messageType, message) {
    	            /*
    	             * Send a message to the parent.
    	             */
    	            window.parent.postMessage(_makeMessage(this.id, messageType, message), '*');
    	        };

    	        /**
    	         * Transmit the current iframe height to the parent.
    	         *
    	         * Call this directly in cases where you manually alter the height of the iframe contents.
    	         *
    	         * @memberof module:pym.Child
    	         * @method sendHeight
    	         * @instance
    	         */
    	        this.sendHeight = function() {
    	            // Get the child's height.
    	            var height = document.getElementsByTagName('body')[0].offsetHeight.toString();

    	            // Send the height to the parent.
    	            this.sendMessage('height', height);

    	            return height;
    	        }.bind(this);

    	        /**
    	         * Ask parent to send the current viewport and iframe position information
    	         *
    	         * @memberof module:pym.Child
    	         * @method sendHeight
    	         * @instance
    	         */
    	        this.getParentPositionInfo = function() {
    	            // Send the height to the parent.
    	            this.sendMessage('parentPositionInfo');
    	        };

    	        /**
    	         * Scroll parent to a given element id.
    	         *
    	         * @memberof module:pym.Child
    	         * @method scrollParentTo
    	         * @instance
    	         *
    	         * @param {String} hash The id of the element to scroll to.
    	         */
    	        this.scrollParentTo = function(hash) {
    	            this.sendMessage('navigateTo', '#' + hash);
    	        };

    	        /**
    	         * Navigate parent to a given url.
    	         *
    	         * @memberof module:pym.Child
    	         * @method navigateParentTo
    	         * @instance
    	         *
    	         * @param {String} url The url to navigate to.
    	         */
    	        this.navigateParentTo = function(url) {
    	            this.sendMessage('navigateTo', url);
    	        };

    	        /**
    	         * Scroll parent to a given child element id.
    	         *
    	         * @memberof module:pym.Child
    	         * @method scrollParentToChildEl
    	         * @instance
    	         *
    	         * @param {String} id The id of the child element to scroll to.
    	         */
    	        this.scrollParentToChildEl = function(id) {
    	            // Get the child element position using getBoundingClientRect + pageYOffset
    	            // via https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    	            var topPos = document.getElementById(id).getBoundingClientRect().top + window.pageYOffset;
    	            this.scrollParentToChildPos(topPos);
    	        };

    	        /**
    	         * Scroll parent to a particular child offset.
    	         *
    	         * @memberof module:pym.Child
    	         * @method scrollParentToChildPos
    	         * @instance
    	         *
    	         * @param {Number} pos The offset of the child element to scroll to.
    	         */
    	        this.scrollParentToChildPos = function(pos) {
    	            this.sendMessage('scrollToChildPos', pos.toString());
    	        };

    	        /**
    	         * Mark Whether the child is embedded or not
    	         * executes a callback in case it was passed to the config
    	         *
    	         * @memberof module:pym.Child
    	         * @method _markWhetherEmbedded
    	         * @inner
    	         *
    	         * @param {module:pym.Child~onMarkedEmbeddedStatus} The callback to execute after determining whether embedded or not.
    	         */
    	        var _markWhetherEmbedded = function(onMarkedEmbeddedStatus) {
    	          var htmlElement = document.getElementsByTagName('html')[0],
    	              newClassForHtml,
    	              originalHtmlClasses = htmlElement.className;
    	          try {
    	            if(window.self !== window.top) {
    	              newClassForHtml = "embedded";
    	            }else {
    	              newClassForHtml = "not-embedded";
    	            }
    	          }catch(e) {
    	            newClassForHtml = "embedded";
    	          }
    	          if(originalHtmlClasses.indexOf(newClassForHtml) < 0) {
    	            htmlElement.className = originalHtmlClasses ? originalHtmlClasses + ' ' + newClassForHtml : newClassForHtml;
    	            if(onMarkedEmbeddedStatus){
    	              onMarkedEmbeddedStatus(newClassForHtml);
    	            }
    	            _raiseCustomEvent("marked-embedded");
    	          }
    	        };

    	        /**
    	         * @callback module:pym.Child~onMarkedEmbeddedStatus
    	         * @param {String} classname "embedded" or "not-embedded".
    	         */

    	        /**
    	         * Unbind child event handlers and timers.
    	         *
    	         * @memberof module:pym.Child
    	         * @method remove
    	         * @instance
    	         */
    	        this.remove = function() {
    	            window.removeEventListener('message', this._processMessage);
    	            if (this.timerId) {
    	                clearInterval(this.timerId);
    	            }
    	        };

    	        // Initialize settings with overrides.
    	        for (var key in config) {
    	            this.settings[key] = config[key];
    	        }

    	        // Identify what ID the parent knows this child as.
    	        this.id = _getParameterByName('childId') || config.id;
    	        this.messageRegex = new RegExp('^pym' + MESSAGE_DELIMITER + this.id + MESSAGE_DELIMITER + '(\\S+)' + MESSAGE_DELIMITER + '(.*)$');

    	        // Get the initial width from a URL parameter.
    	        var width = parseInt(_getParameterByName('initialWidth'));

    	        // Get the url of the parent frame
    	        this.parentUrl = _getParameterByName(this.settings.parenturlparam);

    	        // Get the title of the parent frame
    	        this.parentTitle = _getParameterByName('parentTitle');

    	        // Bind the required message handlers
    	        this.onMessage('width', this._onWidthMessage);

    	        // Set up a listener to handle any incoming messages.
    	        window.addEventListener('message', this._processMessage, false);

    	        // If there's a callback function, call it.
    	        if (this.settings.renderCallback) {
    	            this.settings.renderCallback(width);
    	        }

    	        // Send the initial height to the parent.
    	        this.sendHeight();

    	        // If we're configured to poll, create a setInterval to handle that.
    	        if (this.settings.polling) {
    	            this.timerId = window.setInterval(this.sendHeight, this.settings.polling);
    	        }

    	        _markWhetherEmbedded(config.onMarkedEmbeddedStatus);

    	        return this;
    	    };

    	    // Initialize elements with pym data attributes
    	    // if we are not in server configuration
    	    if(typeof document !== "undefined") {
    	        lib.autoInit(true);
    	    }

    	    return lib;
    	}); 
    } (pym_v1));

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    /* MIT license */

    var conversions$1 = {
      rgb2hsl: rgb2hsl,
      rgb2hsv: rgb2hsv,
      rgb2hwb: rgb2hwb,
      rgb2cmyk: rgb2cmyk,
      rgb2keyword: rgb2keyword,
      rgb2xyz: rgb2xyz,
      rgb2lab: rgb2lab,
      rgb2lch: rgb2lch,

      hsl2rgb: hsl2rgb,
      hsl2hsv: hsl2hsv,
      hsl2hwb: hsl2hwb,
      hsl2cmyk: hsl2cmyk,
      hsl2keyword: hsl2keyword,

      hsv2rgb: hsv2rgb,
      hsv2hsl: hsv2hsl,
      hsv2hwb: hsv2hwb,
      hsv2cmyk: hsv2cmyk,
      hsv2keyword: hsv2keyword,

      hwb2rgb: hwb2rgb,
      hwb2hsl: hwb2hsl,
      hwb2hsv: hwb2hsv,
      hwb2cmyk: hwb2cmyk,
      hwb2keyword: hwb2keyword,

      cmyk2rgb: cmyk2rgb,
      cmyk2hsl: cmyk2hsl,
      cmyk2hsv: cmyk2hsv,
      cmyk2hwb: cmyk2hwb,
      cmyk2keyword: cmyk2keyword,

      keyword2rgb: keyword2rgb,
      keyword2hsl: keyword2hsl,
      keyword2hsv: keyword2hsv,
      keyword2hwb: keyword2hwb,
      keyword2cmyk: keyword2cmyk,
      keyword2lab: keyword2lab,
      keyword2xyz: keyword2xyz,

      xyz2rgb: xyz2rgb,
      xyz2lab: xyz2lab,
      xyz2lch: xyz2lch,

      lab2xyz: lab2xyz,
      lab2rgb: lab2rgb,
      lab2lch: lab2lch,

      lch2lab: lch2lab,
      lch2xyz: lch2xyz,
      lch2rgb: lch2rgb
    };


    function rgb2hsl(rgb) {
      var r = rgb[0]/255,
          g = rgb[1]/255,
          b = rgb[2]/255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s, l;

      if (max == min)
        h = 0;
      else if (r == max)
        h = (g - b) / delta;
      else if (g == max)
        h = 2 + (b - r) / delta;
      else if (b == max)
        h = 4 + (r - g)/ delta;

      h = Math.min(h * 60, 360);

      if (h < 0)
        h += 360;

      l = (min + max) / 2;

      if (max == min)
        s = 0;
      else if (l <= 0.5)
        s = delta / (max + min);
      else
        s = delta / (2 - max - min);

      return [h, s * 100, l * 100];
    }

    function rgb2hsv(rgb) {
      var r = rgb[0],
          g = rgb[1],
          b = rgb[2],
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s, v;

      if (max == 0)
        s = 0;
      else
        s = (delta/max * 1000)/10;

      if (max == min)
        h = 0;
      else if (r == max)
        h = (g - b) / delta;
      else if (g == max)
        h = 2 + (b - r) / delta;
      else if (b == max)
        h = 4 + (r - g) / delta;

      h = Math.min(h * 60, 360);

      if (h < 0)
        h += 360;

      v = ((max / 255) * 1000) / 10;

      return [h, s, v];
    }

    function rgb2hwb(rgb) {
      var r = rgb[0],
          g = rgb[1],
          b = rgb[2],
          h = rgb2hsl(rgb)[0],
          w = 1/255 * Math.min(r, Math.min(g, b)),
          b = 1 - 1/255 * Math.max(r, Math.max(g, b));

      return [h, w * 100, b * 100];
    }

    function rgb2cmyk(rgb) {
      var r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255,
          c, m, y, k;

      k = Math.min(1 - r, 1 - g, 1 - b);
      c = (1 - r - k) / (1 - k) || 0;
      m = (1 - g - k) / (1 - k) || 0;
      y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    }

    function rgb2keyword(rgb) {
      return reverseKeywords[JSON.stringify(rgb)];
    }

    function rgb2xyz(rgb) {
      var r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255;

      // assume sRGB
      r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
      g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
      b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

      var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
      var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
      var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

      return [x * 100, y *100, z * 100];
    }

    function rgb2lab(rgb) {
      var xyz = rgb2xyz(rgb),
            x = xyz[0],
            y = xyz[1],
            z = xyz[2],
            l, a, b;

      x /= 95.047;
      y /= 100;
      z /= 108.883;

      x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
      y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
      z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

      l = (116 * y) - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);

      return [l, a, b];
    }

    function rgb2lch(args) {
      return lab2lch(rgb2lab(args));
    }

    function hsl2rgb(hsl) {
      var h = hsl[0] / 360,
          s = hsl[1] / 100,
          l = hsl[2] / 100,
          t1, t2, t3, rgb, val;

      if (s == 0) {
        val = l * 255;
        return [val, val, val];
      }

      if (l < 0.5)
        t2 = l * (1 + s);
      else
        t2 = l + s - l * s;
      t1 = 2 * l - t2;

      rgb = [0, 0, 0];
      for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * - (i - 1);
        t3 < 0 && t3++;
        t3 > 1 && t3--;

        if (6 * t3 < 1)
          val = t1 + (t2 - t1) * 6 * t3;
        else if (2 * t3 < 1)
          val = t2;
        else if (3 * t3 < 2)
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        else
          val = t1;

        rgb[i] = val * 255;
      }

      return rgb;
    }

    function hsl2hsv(hsl) {
      var h = hsl[0],
          s = hsl[1] / 100,
          l = hsl[2] / 100,
          sv, v;

      if(l === 0) {
          // no need to do calc on black
          // also avoids divide by 0 error
          return [0, 0, 0];
      }

      l *= 2;
      s *= (l <= 1) ? l : 2 - l;
      v = (l + s) / 2;
      sv = (2 * s) / (l + s);
      return [h, sv * 100, v * 100];
    }

    function hsl2hwb(args) {
      return rgb2hwb(hsl2rgb(args));
    }

    function hsl2cmyk(args) {
      return rgb2cmyk(hsl2rgb(args));
    }

    function hsl2keyword(args) {
      return rgb2keyword(hsl2rgb(args));
    }


    function hsv2rgb(hsv) {
      var h = hsv[0] / 60,
          s = hsv[1] / 100,
          v = hsv[2] / 100,
          hi = Math.floor(h) % 6;

      var f = h - Math.floor(h),
          p = 255 * v * (1 - s),
          q = 255 * v * (1 - (s * f)),
          t = 255 * v * (1 - (s * (1 - f))),
          v = 255 * v;

      switch(hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    }

    function hsv2hsl(hsv) {
      var h = hsv[0],
          s = hsv[1] / 100,
          v = hsv[2] / 100,
          sl, l;

      l = (2 - s) * v;
      sl = s * v;
      sl /= (l <= 1) ? l : 2 - l;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    }

    function hsv2hwb(args) {
      return rgb2hwb(hsv2rgb(args))
    }

    function hsv2cmyk(args) {
      return rgb2cmyk(hsv2rgb(args));
    }

    function hsv2keyword(args) {
      return rgb2keyword(hsv2rgb(args));
    }

    // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
    function hwb2rgb(hwb) {
      var h = hwb[0] / 360,
          wh = hwb[1] / 100,
          bl = hwb[2] / 100,
          ratio = wh + bl,
          i, v, f, n;

      // wh + bl cant be > 1
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }

      i = Math.floor(6 * h);
      v = 1 - bl;
      f = 6 * h - i;
      if ((i & 0x01) != 0) {
        f = 1 - f;
      }
      n = wh + f * (v - wh);  // linear interpolation

      switch (i) {
        default:
        case 6:
        case 0: r = v; g = n; b = wh; break;
        case 1: r = n; g = v; b = wh; break;
        case 2: r = wh; g = v; b = n; break;
        case 3: r = wh; g = n; b = v; break;
        case 4: r = n; g = wh; b = v; break;
        case 5: r = v; g = wh; b = n; break;
      }

      return [r * 255, g * 255, b * 255];
    }

    function hwb2hsl(args) {
      return rgb2hsl(hwb2rgb(args));
    }

    function hwb2hsv(args) {
      return rgb2hsv(hwb2rgb(args));
    }

    function hwb2cmyk(args) {
      return rgb2cmyk(hwb2rgb(args));
    }

    function hwb2keyword(args) {
      return rgb2keyword(hwb2rgb(args));
    }

    function cmyk2rgb(cmyk) {
      var c = cmyk[0] / 100,
          m = cmyk[1] / 100,
          y = cmyk[2] / 100,
          k = cmyk[3] / 100,
          r, g, b;

      r = 1 - Math.min(1, c * (1 - k) + k);
      g = 1 - Math.min(1, m * (1 - k) + k);
      b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    }

    function cmyk2hsl(args) {
      return rgb2hsl(cmyk2rgb(args));
    }

    function cmyk2hsv(args) {
      return rgb2hsv(cmyk2rgb(args));
    }

    function cmyk2hwb(args) {
      return rgb2hwb(cmyk2rgb(args));
    }

    function cmyk2keyword(args) {
      return rgb2keyword(cmyk2rgb(args));
    }


    function xyz2rgb(xyz) {
      var x = xyz[0] / 100,
          y = xyz[1] / 100,
          z = xyz[2] / 100,
          r, g, b;

      r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
      g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
      b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

      // assume sRGB
      r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
        : r = (r * 12.92);

      g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
        : g = (g * 12.92);

      b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
        : b = (b * 12.92);

      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);

      return [r * 255, g * 255, b * 255];
    }

    function xyz2lab(xyz) {
      var x = xyz[0],
          y = xyz[1],
          z = xyz[2],
          l, a, b;

      x /= 95.047;
      y /= 100;
      z /= 108.883;

      x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
      y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
      z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

      l = (116 * y) - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);

      return [l, a, b];
    }

    function xyz2lch(args) {
      return lab2lch(xyz2lab(args));
    }

    function lab2xyz(lab) {
      var l = lab[0],
          a = lab[1],
          b = lab[2],
          x, y, z, y2;

      if (l <= 8) {
        y = (l * 100) / 903.3;
        y2 = (7.787 * (y / 100)) + (16 / 116);
      } else {
        y = 100 * Math.pow((l + 16) / 116, 3);
        y2 = Math.pow(y / 100, 1/3);
      }

      x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

      z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

      return [x, y, z];
    }

    function lab2lch(lab) {
      var l = lab[0],
          a = lab[1],
          b = lab[2],
          hr, h, c;

      hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    }

    function lab2rgb(args) {
      return xyz2rgb(lab2xyz(args));
    }

    function lch2lab(lch) {
      var l = lch[0],
          c = lch[1],
          h = lch[2],
          a, b, hr;

      hr = h / 360 * 2 * Math.PI;
      a = c * Math.cos(hr);
      b = c * Math.sin(hr);
      return [l, a, b];
    }

    function lch2xyz(args) {
      return lab2xyz(lch2lab(args));
    }

    function lch2rgb(args) {
      return lab2rgb(lch2lab(args));
    }

    function keyword2rgb(keyword) {
      return cssKeywords[keyword];
    }

    function keyword2hsl(args) {
      return rgb2hsl(keyword2rgb(args));
    }

    function keyword2hsv(args) {
      return rgb2hsv(keyword2rgb(args));
    }

    function keyword2hwb(args) {
      return rgb2hwb(keyword2rgb(args));
    }

    function keyword2cmyk(args) {
      return rgb2cmyk(keyword2rgb(args));
    }

    function keyword2lab(args) {
      return rgb2lab(keyword2rgb(args));
    }

    function keyword2xyz(args) {
      return rgb2xyz(keyword2rgb(args));
    }

    var cssKeywords = {
      aliceblue:  [240,248,255],
      antiquewhite: [250,235,215],
      aqua: [0,255,255],
      aquamarine: [127,255,212],
      azure:  [240,255,255],
      beige:  [245,245,220],
      bisque: [255,228,196],
      black:  [0,0,0],
      blanchedalmond: [255,235,205],
      blue: [0,0,255],
      blueviolet: [138,43,226],
      brown:  [165,42,42],
      burlywood:  [222,184,135],
      cadetblue:  [95,158,160],
      chartreuse: [127,255,0],
      chocolate:  [210,105,30],
      coral:  [255,127,80],
      cornflowerblue: [100,149,237],
      cornsilk: [255,248,220],
      crimson:  [220,20,60],
      cyan: [0,255,255],
      darkblue: [0,0,139],
      darkcyan: [0,139,139],
      darkgoldenrod:  [184,134,11],
      darkgray: [169,169,169],
      darkgreen:  [0,100,0],
      darkgrey: [169,169,169],
      darkkhaki:  [189,183,107],
      darkmagenta:  [139,0,139],
      darkolivegreen: [85,107,47],
      darkorange: [255,140,0],
      darkorchid: [153,50,204],
      darkred:  [139,0,0],
      darksalmon: [233,150,122],
      darkseagreen: [143,188,143],
      darkslateblue:  [72,61,139],
      darkslategray:  [47,79,79],
      darkslategrey:  [47,79,79],
      darkturquoise:  [0,206,209],
      darkviolet: [148,0,211],
      deeppink: [255,20,147],
      deepskyblue:  [0,191,255],
      dimgray:  [105,105,105],
      dimgrey:  [105,105,105],
      dodgerblue: [30,144,255],
      firebrick:  [178,34,34],
      floralwhite:  [255,250,240],
      forestgreen:  [34,139,34],
      fuchsia:  [255,0,255],
      gainsboro:  [220,220,220],
      ghostwhite: [248,248,255],
      gold: [255,215,0],
      goldenrod:  [218,165,32],
      gray: [128,128,128],
      green:  [0,128,0],
      greenyellow:  [173,255,47],
      grey: [128,128,128],
      honeydew: [240,255,240],
      hotpink:  [255,105,180],
      indianred:  [205,92,92],
      indigo: [75,0,130],
      ivory:  [255,255,240],
      khaki:  [240,230,140],
      lavender: [230,230,250],
      lavenderblush:  [255,240,245],
      lawngreen:  [124,252,0],
      lemonchiffon: [255,250,205],
      lightblue:  [173,216,230],
      lightcoral: [240,128,128],
      lightcyan:  [224,255,255],
      lightgoldenrodyellow: [250,250,210],
      lightgray:  [211,211,211],
      lightgreen: [144,238,144],
      lightgrey:  [211,211,211],
      lightpink:  [255,182,193],
      lightsalmon:  [255,160,122],
      lightseagreen:  [32,178,170],
      lightskyblue: [135,206,250],
      lightslategray: [119,136,153],
      lightslategrey: [119,136,153],
      lightsteelblue: [176,196,222],
      lightyellow:  [255,255,224],
      lime: [0,255,0],
      limegreen:  [50,205,50],
      linen:  [250,240,230],
      magenta:  [255,0,255],
      maroon: [128,0,0],
      mediumaquamarine: [102,205,170],
      mediumblue: [0,0,205],
      mediumorchid: [186,85,211],
      mediumpurple: [147,112,219],
      mediumseagreen: [60,179,113],
      mediumslateblue:  [123,104,238],
      mediumspringgreen:  [0,250,154],
      mediumturquoise:  [72,209,204],
      mediumvioletred:  [199,21,133],
      midnightblue: [25,25,112],
      mintcream:  [245,255,250],
      mistyrose:  [255,228,225],
      moccasin: [255,228,181],
      navajowhite:  [255,222,173],
      navy: [0,0,128],
      oldlace:  [253,245,230],
      olive:  [128,128,0],
      olivedrab:  [107,142,35],
      orange: [255,165,0],
      orangered:  [255,69,0],
      orchid: [218,112,214],
      palegoldenrod:  [238,232,170],
      palegreen:  [152,251,152],
      paleturquoise:  [175,238,238],
      palevioletred:  [219,112,147],
      papayawhip: [255,239,213],
      peachpuff:  [255,218,185],
      peru: [205,133,63],
      pink: [255,192,203],
      plum: [221,160,221],
      powderblue: [176,224,230],
      purple: [128,0,128],
      rebeccapurple: [102, 51, 153],
      red:  [255,0,0],
      rosybrown:  [188,143,143],
      royalblue:  [65,105,225],
      saddlebrown:  [139,69,19],
      salmon: [250,128,114],
      sandybrown: [244,164,96],
      seagreen: [46,139,87],
      seashell: [255,245,238],
      sienna: [160,82,45],
      silver: [192,192,192],
      skyblue:  [135,206,235],
      slateblue:  [106,90,205],
      slategray:  [112,128,144],
      slategrey:  [112,128,144],
      snow: [255,250,250],
      springgreen:  [0,255,127],
      steelblue:  [70,130,180],
      tan:  [210,180,140],
      teal: [0,128,128],
      thistle:  [216,191,216],
      tomato: [255,99,71],
      turquoise:  [64,224,208],
      violet: [238,130,238],
      wheat:  [245,222,179],
      white:  [255,255,255],
      whitesmoke: [245,245,245],
      yellow: [255,255,0],
      yellowgreen:  [154,205,50]
    };

    var reverseKeywords = {};
    for (var key in cssKeywords) {
      reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
    }

    var conversions = conversions$1;

    var convert = function() {
       return new Converter();
    };

    for (var func in conversions) {
      // export Raw versions
      convert[func + "Raw"] =  (function(func) {
        // accept array or plain args
        return function(arg) {
          if (typeof arg == "number")
            arg = Array.prototype.slice.call(arguments);
          return conversions[func](arg);
        }
      })(func);

      var pair = /(\w+)2(\w+)/.exec(func),
          from = pair[1],
          to = pair[2];

      // export rgb2hsl and ["rgb"]["hsl"]
      convert[from] = convert[from] || {};

      convert[from][to] = convert[func] = (function(func) { 
        return function(arg) {
          if (typeof arg == "number")
            arg = Array.prototype.slice.call(arguments);
          
          var val = conversions[func](arg);
          if (typeof val == "string" || val === undefined)
            return val; // keyword

          for (var i = 0; i < val.length; i++)
            val[i] = Math.round(val[i]);
          return val;
        }
      })(func);
    }


    /* Converter does lazy conversion and caching */
    var Converter = function() {
       this.convs = {};
    };

    /* Either get the values for a space or
      set the values for a space, depending on args */
    Converter.prototype.routeSpace = function(space, args) {
       var values = args[0];
       if (values === undefined) {
          // color.rgb()
          return this.getValues(space);
       }
       // color.rgb(10, 10, 10)
       if (typeof values == "number") {
          values = Array.prototype.slice.call(args);        
       }

       return this.setValues(space, values);
    };
      
    /* Set the values for a space, invalidating cache */
    Converter.prototype.setValues = function(space, values) {
       this.space = space;
       this.convs = {};
       this.convs[space] = values;
       return this;
    };

    /* Get the values for a space. If there's already
      a conversion for the space, fetch it, otherwise
      compute it */
    Converter.prototype.getValues = function(space) {
       var vals = this.convs[space];
       if (!vals) {
          var fspace = this.space,
              from = this.convs[fspace];
          vals = convert[fspace][space](from);

          this.convs[space] = vals;
       }
      return vals;
    };

    ["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
       Converter.prototype[space] = function(vals) {
          return this.routeSpace(space, arguments);
       };
    });

    /* node_modules\@onsvisual\svelte-components\dist\layout\Scroller\Scroller.svelte generated by Svelte v3.59.2 */

    const handlers = [];

    if (typeof window !== "undefined") {
    	const run_all = () => handlers.forEach(fn => fn());
    	window.addEventListener("scroll", run_all);
    	window.addEventListener("resize", run_all);
    }

    if (typeof IntersectionObserver !== "undefined") {
    	const map = new Map();

    	new IntersectionObserver((entries, observer) => {
    			entries.forEach(entry => {
    				const update = map.get(entry.target);
    				const index = handlers.indexOf(update);

    				if (entry.isIntersecting) {
    					if (index === -1) handlers.push(update);
    				} else {
    					update();
    					if (index !== -1) handlers.splice(index, 1);
    				}
    			});
    		},
    	{
    			rootMargin: "400px 0px", // TODO why 400?
    			
    		});
    }

    /* node_modules\@onsvisual\svelte-components\dist\inputs\Dropdown\Dropdown.svelte generated by Svelte v3.59.2 */
    const file$2 = "node_modules\\@onsvisual\\svelte-components\\dist\\inputs\\Dropdown\\Dropdown.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (39:2) {#if label}
    function create_if_block_1$2(ctx) {
    	let label_1;
    	let t;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t = text(/*label*/ ctx[2]);
    			attr_dev(label_1, "class", "ons-label");
    			attr_dev(label_1, "for", /*id*/ ctx[1]);
    			toggle_class(label_1, "ons-u-vh", /*hideLabel*/ ctx[3]);
    			add_location(label_1, file$2, 39, 4, 814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 4) set_data_dev(t, /*label*/ ctx[2]);

    			if (dirty & /*id*/ 2) {
    				attr_dev(label_1, "for", /*id*/ ctx[1]);
    			}

    			if (dirty & /*hideLabel*/ 8) {
    				toggle_class(label_1, "ons-u-vh", /*hideLabel*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(39:2) {#if label}",
    		ctx
    	});

    	return block;
    }

    // (49:4) {#if placeholder}
    function create_if_block$3(ctx) {
    	let option;
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(/*placeholder*/ ctx[4]);
    			option.__value = null;
    			option.value = option.__value;
    			option.selected = true;
    			option.disabled = true;
    			add_location(option, file$2, 49, 6, 1087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 16) set_data_dev(t, /*placeholder*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(49:4) {#if placeholder}",
    		ctx
    	});

    	return block;
    }

    // (52:4) {#each options as option}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = (/*option*/ ctx[9]?.label || /*option*/ ctx[9]) + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*option*/ ctx[9];
    			option.value = option.__value;
    			add_location(option, file$2, 52, 6, 1197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 32 && t_value !== (t_value = (/*option*/ ctx[9]?.label || /*option*/ ctx[9]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 32 && option_value_value !== (option_value_value = /*option*/ ctx[9])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(52:4) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let t;
    	let select;
    	let if_block1_anchor;
    	let mounted;
    	let dispose;
    	let if_block0 = /*label*/ ctx[2] && create_if_block_1$2(ctx);
    	let if_block1 = /*placeholder*/ ctx[4] && create_if_block$3(ctx);
    	let each_value = /*options*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			select = element("select");
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "id", /*id*/ ctx[1]);
    			attr_dev(select, "name", /*id*/ ctx[1]);
    			attr_dev(select, "class", "ons-input ons-input--select svelte-4cr5ai");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[7].call(select));
    			add_location(select, file$2, 41, 2, 905);
    			attr_dev(div, "class", "ons-field");
    			add_location(div, file$2, 37, 0, 772);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			append_dev(div, select);
    			if (if_block1) if_block1.m(select, null);
    			append_dev(select, if_block1_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*value*/ ctx[0], true);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[7]),
    					listen_dev(select, "change", /*change_handler*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*label*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*placeholder*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(select, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*options*/ 32) {
    				each_value = /*options*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*id*/ 2) {
    				attr_dev(select, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*id*/ 2) {
    				attr_dev(select, "name", /*id*/ ctx[1]);
    			}

    			if (dirty & /*value, options*/ 33) {
    				select_option(select, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, []);
    	const dispatch = createEventDispatcher();
    	let { id = "" } = $$props;
    	let { label = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { placeholder = "Select an option" } = $$props;
    	let { value = null } = $$props;
    	let { options = [] } = $$props;
    	const writable_props = ['id', 'label', 'hideLabel', 'placeholder', 'value', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(0, value);
    		$$invalidate(5, options);
    	}

    	const change_handler = e => dispatch('change', e);

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('hideLabel' in $$props) $$invalidate(3, hideLabel = $$props.hideLabel);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('options' in $$props) $$invalidate(5, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		id,
    		label,
    		hideLabel,
    		placeholder,
    		value,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('hideLabel' in $$props) $$invalidate(3, hideLabel = $$props.hideLabel);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('options' in $$props) $$invalidate(5, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		id,
    		label,
    		hideLabel,
    		placeholder,
    		options,
    		dispatch,
    		select_change_handler,
    		change_handler
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			id: 1,
    			label: 2,
    			hideLabel: 3,
    			placeholder: 4,
    			value: 0,
    			options: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get id() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Glossary.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\Glossary.svelte";

    // (40:2) {#if value}
    function create_if_block$2(ctx) {
    	let div;
    	let p0;
    	let t0_value = /*value*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let p1;
    	let raw_value = /*value*/ ctx[0].descriptiontext + "";
    	let t2;
    	let if_block_anchor;
    	let if_block = /*lastGlossaryClick*/ ctx[1] !== "" && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p0, "id", "yourtermp");
    			attr_dev(p0, "class", "svelte-tm93jk");
    			add_location(p0, file$1, 41, 6, 1136);
    			attr_dev(p1, "id", "descriptionp");
    			attr_dev(p1, "class", "svelte-tm93jk");
    			add_location(p1, file$1, 42, 6, 1179);
    			attr_dev(div, "id", "resulttext");
    			attr_dev(div, "aria-live", "assertive");
    			attr_dev(div, "class", "svelte-tm93jk");
    			add_location(div, file$1, 40, 4, 1085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			p1.innerHTML = raw_value;
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1 && t0_value !== (t0_value = /*value*/ ctx[0].label + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*value*/ 1 && raw_value !== (raw_value = /*value*/ ctx[0].descriptiontext + "")) p1.innerHTML = raw_value;
    			if (/*lastGlossaryClick*/ ctx[1] !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:2) {#if value}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if lastGlossaryClick !== ""}
    function create_if_block_1$1(ctx) {
    	let a;
    	let t;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text("▲ Go back");
    			attr_dev(a, "href", a_href_value = "#" + /*lastGlossaryClick*/ ctx[1]);
    			attr_dev(a, "id", "goBackButton");
    			add_location(a, file$1, 46, 6, 1293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					function () {
    						if (is_function(/*lastGlossaryClick*/ ctx[1] = "")) (/*lastGlossaryClick*/ ctx[1] = "").apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*lastGlossaryClick*/ 2 && a_href_value !== (a_href_value = "#" + /*lastGlossaryClick*/ ctx[1])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(46:4) {#if lastGlossaryClick !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let label;
    	let t4;
    	let dropdown;
    	let updating_value;
    	let t5;
    	let current;

    	function dropdown_value_binding(value) {
    		/*dropdown_value_binding*/ ctx[6](value);
    	}

    	let dropdown_props = { options: /*graphic_data*/ ctx[3] };

    	if (/*value*/ ctx[0] !== void 0) {
    		dropdown_props.value = /*value*/ ctx[0];
    	}

    	dropdown = new Dropdown({ props: dropdown_props, $$inline: true });
    	binding_callbacks.push(() => bind(dropdown, 'value', dropdown_value_binding));
    	dropdown.$on("change", /*handleChange*/ ctx[2]);
    	let if_block = /*value*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Definitions";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			label = element("label");
    			label.textContent = "Select a term to see its description";
    			t4 = space();
    			create_component(dropdown.$$.fragment);
    			t5 = space();
    			if (if_block) if_block.c();
    			attr_dev(h3, "id", "title");
    			attr_dev(h3, "class", "svelte-tm93jk");
    			add_location(h3, file$1, 27, 4, 709);
    			attr_dev(div0, "id", "banner");
    			attr_dev(div0, "class", "svelte-tm93jk");
    			add_location(div0, file$1, 26, 2, 686);
    			attr_dev(div1, "id", "divider");
    			attr_dev(div1, "class", "svelte-tm93jk");
    			add_location(div1, file$1, 29, 2, 754);
    			attr_dev(label, "id", "selectTermText");
    			attr_dev(label, "for", "select");
    			attr_dev(label, "aria-label", "Select a term to see its description");
    			attr_dev(label, "class", "svelte-tm93jk");
    			add_location(label, file$1, 31, 4, 808);
    			attr_dev(div2, "id", "inputform");
    			attr_dev(div2, "class", "svelte-tm93jk");
    			add_location(div2, file$1, 30, 2, 782);
    			attr_dev(div3, "id", "container");
    			attr_dev(div3, "class", "svelte-tm93jk");
    			add_location(div3, file$1, 25, 0, 662);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, label);
    			append_dev(div2, t4);
    			mount_component(dropdown, div2, null);
    			append_dev(div3, t5);
    			if (if_block) if_block.m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dropdown_changes = {};

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				dropdown_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			dropdown.$set(dropdown_changes);

    			if (/*value*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(dropdown);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Glossary', slots, []);
    	let { glossarySelected } = $$props;
    	let { glossary } = $$props;
    	let { lastGlossaryClick } = $$props;
    	let { value = null } = $$props;

    	// Define your own function on change
    	const handleChange = e => {
    		pymChild.sendHeight();
    	};

    	//d3.select('#text').html(value.descriptiontext)
    	//load chart data
    	let graphic_data = glossary;

    	$$self.$$.on_mount.push(function () {
    		if (glossarySelected === undefined && !('glossarySelected' in $$props || $$self.$$.bound[$$self.$$.props['glossarySelected']])) {
    			console.warn("<Glossary> was created without expected prop 'glossarySelected'");
    		}

    		if (glossary === undefined && !('glossary' in $$props || $$self.$$.bound[$$self.$$.props['glossary']])) {
    			console.warn("<Glossary> was created without expected prop 'glossary'");
    		}

    		if (lastGlossaryClick === undefined && !('lastGlossaryClick' in $$props || $$self.$$.bound[$$self.$$.props['lastGlossaryClick']])) {
    			console.warn("<Glossary> was created without expected prop 'lastGlossaryClick'");
    		}
    	});

    	const writable_props = ['glossarySelected', 'glossary', 'lastGlossaryClick', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Glossary> was created with unknown prop '${key}'`);
    	});

    	function dropdown_value_binding(value$1) {
    		value = value$1;
    		(($$invalidate(0, value), $$invalidate(3, graphic_data)), $$invalidate(4, glossarySelected));
    	}

    	$$self.$$set = $$props => {
    		if ('glossarySelected' in $$props) $$invalidate(4, glossarySelected = $$props.glossarySelected);
    		if ('glossary' in $$props) $$invalidate(5, glossary = $$props.glossary);
    		if ('lastGlossaryClick' in $$props) $$invalidate(1, lastGlossaryClick = $$props.lastGlossaryClick);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		Dropdown,
    		csvParse,
    		onMount,
    		glossarySelected,
    		glossary,
    		lastGlossaryClick,
    		value,
    		handleChange,
    		graphic_data
    	});

    	$$self.$inject_state = $$props => {
    		if ('glossarySelected' in $$props) $$invalidate(4, glossarySelected = $$props.glossarySelected);
    		if ('glossary' in $$props) $$invalidate(5, glossary = $$props.glossary);
    		if ('lastGlossaryClick' in $$props) $$invalidate(1, lastGlossaryClick = $$props.lastGlossaryClick);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('graphic_data' in $$props) $$invalidate(3, graphic_data = $$props.graphic_data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*glossarySelected*/ 16) {
    			$$invalidate(0, value = graphic_data.find(e => e.hash == glossarySelected));
    		}
    	};

    	return [
    		value,
    		lastGlossaryClick,
    		handleChange,
    		graphic_data,
    		glossarySelected,
    		glossary,
    		dropdown_value_binding
    	];
    }

    class Glossary extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			glossarySelected: 4,
    			glossary: 5,
    			lastGlossaryClick: 1,
    			value: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Glossary",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get glossarySelected() {
    		throw new Error("<Glossary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set glossarySelected(value) {
    		throw new Error("<Glossary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get glossary() {
    		throw new Error("<Glossary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set glossary(value) {
    		throw new Error("<Glossary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lastGlossaryClick() {
    		throw new Error("<Glossary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lastGlossaryClick(value) {
    		throw new Error("<Glossary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Glossary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Glossary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var topics = [
    	{
    		id: "wellbeing",
    		title: "Personal well-being",
    		description: "Personal well-being is the most direct representation of how people are doing. Measures in this topic area cover people’s opinions on aspects of their current well-being."
    	},
    	{
    		id: "relationships",
    		title: "Our relationships",
    		description: "People's relationships can affect their well-being outcomes, including quality of life and happiness. Measures in this topic area cover the presence and quality of relationships people may have with family, friends, and the community around them."
    	},
    	{
    		id: "health",
    		title: "Health",
    		description: "Physical and mental health are important parts of people’s personal well-being. Measures in this topic area cover both [(objective)objective] and [(subjective)subjective] measures of health. They also cover satisfaction with the healthcare system to capture how the nation’s health is supported."
    	},
    	{
    		id: "do",
    		title: "What we do",
    		description: "Participation in, satisfaction with, and balance between work and leisure activities represent people’s lifestyle choices. Measures in this topic area cover [(subjective)subjective] and [(objective)objective] measures related to work, leisure and volunteering."
    	},
    	{
    		id: "live",
    		title: "Where we live",
    		description: "Where people live, the quality of their local area and their community, and how they feel about it can affect personal well-being. Measures in this topic area cover housing, the local environment, access to facilities, and being part of a cohesive community."
    	},
    	{
    		id: "finance",
    		title: "Personal finance",
    		description: "How households and individuals are managing financially influences many aspects of their lives. Measures in this topic area cover household income and wealth, poverty and financial inequalities, and people’s opinions about their own financial situations."
    	},
    	{
    		id: "skills",
    		title: "Education and skills",
    		description: "Education and skills can determine individuals’ socioeconomic outcomes. Measures in this topic area cover human capital, as well as qualifications and skills. They also cover satisfaction with the education system to capture how people’s education is supported."
    	},
    	{
    		id: "economy",
    		title: "Economy",
    		description: "The economy affects the financial welfare of individuals, communities and the UK as a whole. Measures in this topic area cover economic activity in the UK. They also cover consumer confidence to capture people's perceptions of the country's economic situation."
    	},
    	{
    		id: "governance",
    		title: "Governance",
    		description: "Good governance contributes to better social and economic outcomes. Measures in this topic area cover public trust and civic participation. They also cover satisfaction with the police and justice system to capture how public administration is supported."
    	},
    	{
    		id: "environment",
    		title: "Environment",
    		description: "The natural environment is relevant to people’s quality of life because it makes human life and activity possible. Measures in this topic area cover aspects of climate change, the UK’s natural environment and natural capital, and the effects of human activity on the environment."
    	}
    ];

    var outlooks = [
    	{
    		id: "allMeasures",
    		title: "All measures"
    	},
    	{
    		id: "Positive change",
    		title: "Positive change"
    	},
    	{
    		id: "Negative change",
    		title: "Negative change"
    	},
    	{
    		id: "No change",
    		title: "No change"
    	},
    	{
    		id: "Change not assessed",
    		title: "Change not assessed"
    	}
    ];

    function createUrlStore(ssrUrl) {
      // Ideally a bundler constant so that it's tree-shakable
      if (typeof window === 'undefined') {
        const { subscribe } = writable(ssrUrl);
        return { subscribe }
      }

      const href = writable(window.location.href);

      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      const updateHref = () => href.set(window.location.href);

      history.pushState = function () {
        originalPushState.apply(this, arguments);
        updateHref();
      };

      history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        updateHref();
      };

      window.addEventListener('popstate', updateHref);
      window.addEventListener('hashchange', updateHref);

      return {
        subscribe: derived(href, ($href) => new URL($href)).subscribe
      }
    }

    // If you're using in a pure SPA, you can return a store directly and share it everywhere
    var url = createUrlStore();

    var order = [
      'lifeSat',
      'worthwhile',
      'happiness',
      'anxious',
      'hopeFuture',
      'fairTreatment',
      'satisRship',
      'satisSocial',
      'relyOn',
      'loneliness',
      'commInt',
      'trustOthers',
      'lifeExpect',
      'satisHealth',
      'healthstat',
      'physicalHealth',
      'depressionAnxiety',
      'satisHealthcare',
      'satisTime',
      'satisJob',
      'unpaidWork',
      'volunteering',
      'artsCulture',
      'sportsPart',
      'nature',
      'satisAccomm',
      'satisLocal',
      'belongNeigh',
      'digitalEx',
      'crime',
      'feelingSafe',
      'hholdIncome',
      'hholdWealth',
      'lowIncome',
      'incomeInequal',
      'genderPaygap',
      'diffFinance',
      'neet',
      'noQuals',
      'alevelQuals',
      'humanCapital',
      'satisSkills',
      'satisEducation',
      'unemployment',
      'inflation',
      'GDP',
      'publicsecDebt',
      'consumerConf',
      'voterTurnout',
      'trustGov',
      'voice',
      'satisPolice',
      'satisCourts',
      'greenhouseGas',
      'renewableEnergy',
      'hholdRecycling',
      'protectedArea',
      'biodiversity',
      'airPoll',
      'waterPoll',
      'envLifestyle'];

    /* src\Dashboard.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\Dashboard.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[26] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    // (182:2) {#each outlooks as value}
    function create_each_block_4(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let raw_value = /*value*/ ctx[35].title + "";
    	let t3;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[18][1]);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			t2 = element("t");
    			t3 = space();
    			attr_dev(input, "name", "outlooks");
    			attr_dev(input, "type", "radio");
    			input.__value = /*value*/ ctx[35];
    			input.value = input.__value;
    			attr_dev(input, "tabindex", "0");
    			add_location(input, file, 183, 4, 4943);
    			attr_dev(span, "class", "checkmarkRadio");
    			add_location(span, file, 190, 4, 5065);
    			attr_dev(t2, "class", "checkBoxText");
    			add_location(t2, file, 191, 4, 5107);
    			attr_dev(label, "class", "filterContainer");
    			add_location(label, file, 182, 3, 4906);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*selected*/ ctx[3];
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			t2.innerHTML = raw_value;
    			append_dev(label, t3);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selected*/ 8) {
    				input.checked = input.__value === /*selected*/ ctx[3];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			binding_group.r();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(182:2) {#each outlooks as value}",
    		ctx
    	});

    	return block;
    }

    // (208:2) {#each updatedTopics as topic}
    function create_each_block_3(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let raw_value = /*topic*/ ctx[27].title + "";
    	let t3;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[18][0]);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			t2 = element("t");
    			t3 = space();
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*topic*/ ctx[27];
    			input.value = input.__value;
    			attr_dev(input, "name", /*topic*/ ctx[27]);
    			attr_dev(input, "tabindex", "0");
    			add_location(input, file, 209, 4, 5568);
    			attr_dev(span, "class", "checkmarkBox");
    			add_location(span, file, 216, 4, 5702);
    			attr_dev(t2, "class", "checkBoxText");
    			add_location(t2, file, 217, 4, 5742);
    			attr_dev(label, "class", "filterContainer");
    			add_location(label, file, 208, 3, 5531);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = ~(/*selectedTopics*/ ctx[5] || []).indexOf(input.__value);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			t2.innerHTML = raw_value;
    			append_dev(label, t3);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedTopics*/ 32) {
    				input.checked = ~(/*selectedTopics*/ ctx[5] || []).indexOf(input.__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			binding_group.r();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(208:2) {#each updatedTopics as topic}",
    		ctx
    	});

    	return block;
    }

    // (284:8) {:else}
    function create_else_block(ctx) {
    	let p;
    	let raw_value = /*row*/ ctx[30].outlook + "";
    	let p_class_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", p_class_value = "outlook " + /*row*/ ctx[30].outlook + " svelte-orjvly");
    			add_location(p, file, 284, 9, 8006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && raw_value !== (raw_value = /*row*/ ctx[30].outlook + "")) p.innerHTML = raw_value;
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && p_class_value !== (p_class_value = "outlook " + /*row*/ ctx[30].outlook + " svelte-orjvly")) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(284:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (255:8) {#if row.outlook2 && row.outlook2 !== "Change not assessed"}
    function create_if_block_5(ctx) {
    	let p0;

    	let t0_value = (/*row*/ ctx[30].measure == "feelingSafe" || /*row*/ ctx[30].measure == "unpaidWork" || /*row*/ ctx[30].measure == "lifeExpect"
    	? "M:"
    	: /*row*/ ctx[30].measure == "airPoll"
    		? "U:"
    		: /*row*/ ctx[30].measure == "biodiversity"
    			? "Index 1:"
    			: "La:") + "";

    	let t0;
    	let p0_class_value;
    	let t1;
    	let p1;
    	let raw0_value = /*row*/ ctx[30].outlook + "";
    	let p1_class_value;
    	let t2;
    	let p2;

    	let t3_value = (/*row*/ ctx[30].measure == "feelingSafe" || /*row*/ ctx[30].measure == "unpaidWork" || /*row*/ ctx[30].measure == "lifeExpect"
    	? "F:"
    	: /*row*/ ctx[30].measure == "airPoll"
    		? "R:"
    		: /*row*/ ctx[30].measure == "biodiversity"
    			? "Index 2:"
    			: "Se:") + "";

    	let t3;
    	let p2_class_value;
    	let t4;
    	let p3;
    	let raw1_value = /*row*/ ctx[30].outlook2 + "";
    	let p3_class_value;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = space();
    			p2 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p3 = element("p");
    			attr_dev(p0, "class", p0_class_value = "" + (null_to_empty("percent " + /*row*/ ctx[30].measure + "1") + " svelte-orjvly"));
    			add_location(p0, file, 255, 9, 7064);
    			attr_dev(p1, "class", p1_class_value = "outlook " + /*row*/ ctx[30].outlook + " svelte-orjvly");
    			add_location(p1, file, 266, 9, 7430);
    			attr_dev(p2, "class", p2_class_value = "" + (null_to_empty("percent " + /*row*/ ctx[30].measure + "2") + " svelte-orjvly"));
    			add_location(p2, file, 269, 9, 7520);
    			attr_dev(p3, "class", p3_class_value = "outlook " + /*row*/ ctx[30].outlook2 + " svelte-orjvly");
    			add_location(p3, file, 280, 9, 7897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			p1.innerHTML = raw0_value;
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p3, anchor);
    			p3.innerHTML = raw1_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && t0_value !== (t0_value = (/*row*/ ctx[30].measure == "feelingSafe" || /*row*/ ctx[30].measure == "unpaidWork" || /*row*/ ctx[30].measure == "lifeExpect"
    			? "M:"
    			: /*row*/ ctx[30].measure == "airPoll"
    				? "U:"
    				: /*row*/ ctx[30].measure == "biodiversity"
    					? "Index 1:"
    					: "La:") + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && p0_class_value !== (p0_class_value = "" + (null_to_empty("percent " + /*row*/ ctx[30].measure + "1") + " svelte-orjvly"))) {
    				attr_dev(p0, "class", p0_class_value);
    			}

    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && raw0_value !== (raw0_value = /*row*/ ctx[30].outlook + "")) p1.innerHTML = raw0_value;
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && p1_class_value !== (p1_class_value = "outlook " + /*row*/ ctx[30].outlook + " svelte-orjvly")) {
    				attr_dev(p1, "class", p1_class_value);
    			}

    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && t3_value !== (t3_value = (/*row*/ ctx[30].measure == "feelingSafe" || /*row*/ ctx[30].measure == "unpaidWork" || /*row*/ ctx[30].measure == "lifeExpect"
    			? "F:"
    			: /*row*/ ctx[30].measure == "airPoll"
    				? "R:"
    				: /*row*/ ctx[30].measure == "biodiversity"
    					? "Index 2:"
    					: "Se:") + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && p2_class_value !== (p2_class_value = "" + (null_to_empty("percent " + /*row*/ ctx[30].measure + "2") + " svelte-orjvly"))) {
    				attr_dev(p2, "class", p2_class_value);
    			}

    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && raw1_value !== (raw1_value = /*row*/ ctx[30].outlook2 + "")) p3.innerHTML = raw1_value;
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && p3_class_value !== (p3_class_value = "outlook " + /*row*/ ctx[30].outlook2 + " svelte-orjvly")) {
    				attr_dev(p3, "class", p3_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(255:8) {#if row.outlook2 && row.outlook2 !== \\\"Change not assessed\\\"}",
    		ctx
    	});

    	return block;
    }

    // (291:6) {#if row.since}
    function create_if_block_4(ctx) {
    	let div;
    	let t0;
    	let t1_value = formatDate(/*row*/ ctx[30].since) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Since: ");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "since");
    			add_location(div, file, 291, 7, 8161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41 && t1_value !== (t1_value = formatDate(/*row*/ ctx[30].since) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(291:6) {#if row.since}",
    		ctx
    	});

    	return block;
    }

    // (305:6) {#if row.type == "line"}
    function create_if_block_3(ctx) {
    	let linechart;
    	let current;

    	linechart = new LineChart({
    			props: {
    				id: "" + (/*row*/ ctx[30].measure + "_chart"),
    				row: /*row*/ ctx[30],
    				dataCharts: /*dataCharts*/ ctx[2],
    				type: "line"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(linechart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(linechart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const linechart_changes = {};
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) linechart_changes.id = "" + (/*row*/ ctx[30].measure + "_chart");
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) linechart_changes.row = /*row*/ ctx[30];
    			if (dirty[0] & /*dataCharts*/ 4) linechart_changes.dataCharts = /*dataCharts*/ ctx[2];
    			linechart.$set(linechart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linechart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linechart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(linechart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(305:6) {#if row.type == \\\"line\\\"}",
    		ctx
    	});

    	return block;
    }

    // (313:6) {#if row.type == "dualLine"}
    function create_if_block_2(ctx) {
    	let duallinechart;
    	let current;

    	duallinechart = new DualLineChart({
    			props: {
    				id: "" + (/*row*/ ctx[30].measure + "_chart"),
    				row: /*row*/ ctx[30],
    				dataCharts: /*dataCharts*/ ctx[2],
    				type: "dualLine"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(duallinechart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(duallinechart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const duallinechart_changes = {};
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) duallinechart_changes.id = "" + (/*row*/ ctx[30].measure + "_chart");
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) duallinechart_changes.row = /*row*/ ctx[30];
    			if (dirty[0] & /*dataCharts*/ 4) duallinechart_changes.dataCharts = /*dataCharts*/ ctx[2];
    			duallinechart.$set(duallinechart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(duallinechart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(duallinechart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(duallinechart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(313:6) {#if row.type == \\\"dualLine\\\"}",
    		ctx
    	});

    	return block;
    }

    // (321:6) {#if row.type == "number"}
    function create_if_block_1(ctx) {
    	let staticnumber;
    	let current;

    	staticnumber = new StaticNumber({
    			props: {
    				id: "" + (/*row*/ ctx[30].measure + "_chart"),
    				row: /*row*/ ctx[30],
    				dataCharts: /*dataCharts*/ ctx[2],
    				dataText: /*dataText*/ ctx[0],
    				type: "number"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(staticnumber.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(staticnumber, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const staticnumber_changes = {};
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) staticnumber_changes.id = "" + (/*row*/ ctx[30].measure + "_chart");
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) staticnumber_changes.row = /*row*/ ctx[30];
    			if (dirty[0] & /*dataCharts*/ 4) staticnumber_changes.dataCharts = /*dataCharts*/ ctx[2];
    			if (dirty[0] & /*dataText*/ 1) staticnumber_changes.dataText = /*dataText*/ ctx[0];
    			staticnumber.$set(staticnumber_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(staticnumber.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(staticnumber.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(staticnumber, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(321:6) {#if row.type == \\\"number\\\"}",
    		ctx
    	});

    	return block;
    }

    // (330:6) {#if row.type == "bar"}
    function create_if_block$1(ctx) {
    	let columnchart;
    	let current;

    	columnchart = new ColumnChart({
    			props: {
    				id: "" + (/*row*/ ctx[30].measure + "_chart"),
    				row: /*row*/ ctx[30],
    				dataCharts: /*dataCharts*/ ctx[2],
    				dataText: /*dataText*/ ctx[0],
    				type: "bar"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(columnchart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(columnchart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const columnchart_changes = {};
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) columnchart_changes.id = "" + (/*row*/ ctx[30].measure + "_chart");
    			if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) columnchart_changes.row = /*row*/ ctx[30];
    			if (dirty[0] & /*dataCharts*/ 4) columnchart_changes.dataCharts = /*dataCharts*/ ctx[2];
    			if (dirty[0] & /*dataText*/ 1) columnchart_changes.dataText = /*dataText*/ ctx[0];
    			columnchart.$set(columnchart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(columnchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(columnchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(columnchart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(330:6) {#if row.type == \\\"bar\\\"}",
    		ctx
    	});

    	return block;
    }

    // (242:1) {#each dataText.filter((d) => d.topic === topic.id && (selected.id === d.outlook || selected.id === d.outlook2 || selected.id === "allMeasures")) as row}
    function create_each_block_2(ctx) {
    	let hr;
    	let hr_class_value;
    	let t0;
    	let div12;
    	let div11;
    	let div10;
    	let div7;
    	let div3;
    	let div1;
    	let div0;
    	let raw0_value = /*row*/ ctx[30].measuretitle + "";
    	let div0_class_value;
    	let t1;
    	let div2;
    	let t2;
    	let t3;
    	let div4;
    	let raw1_value = /*row*/ ctx[30].title + "";
    	let t4;
    	let div5;
    	let raw2_value = /*row*/ ctx[30].commstext + "";
    	let t5;
    	let div6;
    	let t6;
    	let a0;
    	let raw3_value = /*row*/ ctx[30].sourcetext + "";
    	let a0_href_value;
    	let t7;
    	let div8;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let div9;
    	let t12;
    	let a1;
    	let raw4_value = /*row*/ ctx[30].sourcetext + "";
    	let a1_href_value;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*row*/ ctx[30].outlook2 && /*row*/ ctx[30].outlook2 !== "Change not assessed") return create_if_block_5;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*row*/ ctx[30].since && create_if_block_4(ctx);
    	let if_block2 = /*row*/ ctx[30].type == "line" && create_if_block_3(ctx);
    	let if_block3 = /*row*/ ctx[30].type == "dualLine" && create_if_block_2(ctx);
    	let if_block4 = /*row*/ ctx[30].type == "number" && create_if_block_1(ctx);
    	let if_block5 = /*row*/ ctx[30].type == "bar" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			t0 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div7 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div2 = element("div");
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = text("Source: ");
    			a0 = element("a");
    			t7 = space();
    			div8 = element("div");
    			if (if_block2) if_block2.c();
    			t8 = space();
    			if (if_block3) if_block3.c();
    			t9 = space();
    			if (if_block4) if_block4.c();
    			t10 = space();
    			if (if_block5) if_block5.c();
    			t11 = space();
    			div9 = element("div");
    			t12 = text("Source: ");
    			a1 = element("a");
    			attr_dev(hr, "class", hr_class_value = "" + (/*topic*/ ctx[27].id + " dividerThin" + " svelte-orjvly"));
    			add_location(hr, file, 242, 2, 6522);
    			attr_dev(div0, "class", div0_class_value = "measure " + /*row*/ ctx[30].topic + " svelte-orjvly");
    			add_location(div0, file, 249, 8, 6855);
    			attr_dev(div1, "class", "BgColour");
    			add_location(div1, file, 248, 7, 6823);
    			attr_dev(div2, "class", "change");
    			add_location(div2, file, 253, 7, 6963);
    			attr_dev(div3, "class", "containerTop containerTop0");
    			add_location(div3, file, 247, 6, 6774);
    			attr_dev(div4, "class", "title");
    			add_location(div4, file, 295, 6, 8256);
    			attr_dev(div5, "class", "commentary");
    			add_location(div5, file, 296, 6, 8306);
    			attr_dev(a0, "href", a0_href_value = /*row*/ ctx[30].sourceURL);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-orjvly");
    			add_location(a0, file, 298, 15, 8402);
    			attr_dev(div6, "class", "source");
    			add_location(div6, file, 297, 6, 8365);
    			attr_dev(div7, "id", "tile");
    			attr_dev(div7, "class", "tile tile0");
    			add_location(div7, file, 246, 5, 6732);
    			attr_dev(div8, "aria-hidden", "true");
    			attr_dev(div8, "class", "chart chart0");
    			add_location(div8, file, 303, 5, 8521);
    			attr_dev(a1, "href", a1_href_value = /*row*/ ctx[30].sourceURL);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-orjvly");
    			add_location(a1, file, 340, 14, 9350);
    			attr_dev(div9, "class", "source2");
    			add_location(div9, file, 339, 5, 9313);
    			attr_dev(div10, "aria-hidden", "true");
    			attr_dev(div10, "id", "secondLayer");
    			attr_dev(div10, "class", "layer layer0");
    			add_location(div10, file, 245, 4, 6663);
    			attr_dev(div11, "aria-hidden", "true");
    			attr_dev(div11, "id", "top");
    			add_location(div11, file, 244, 3, 6624);
    			attr_dev(div12, "aria-live", "assertive");
    			attr_dev(div12, "id", "tileshere");
    			attr_dev(div12, "tabindex", "-1");
    			add_location(div12, file, 243, 2, 6563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div7);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			div0.innerHTML = raw0_value;
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			if_block0.m(div2, null);
    			append_dev(div7, t2);
    			if (if_block1) if_block1.m(div7, null);
    			append_dev(div7, t3);
    			append_dev(div7, div4);
    			div4.innerHTML = raw1_value;
    			append_dev(div7, t4);
    			append_dev(div7, div5);
    			div5.innerHTML = raw2_value;
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, t6);
    			append_dev(div6, a0);
    			a0.innerHTML = raw3_value;
    			append_dev(div10, t7);
    			append_dev(div10, div8);
    			if (if_block2) if_block2.m(div8, null);
    			append_dev(div8, t8);
    			if (if_block3) if_block3.m(div8, null);
    			append_dev(div8, t9);
    			if (if_block4) if_block4.m(div8, null);
    			append_dev(div8, t10);
    			if (if_block5) if_block5.m(div8, null);
    			append_dev(div10, t11);
    			append_dev(div10, div9);
    			append_dev(div9, t12);
    			append_dev(div9, a1);
    			a1.innerHTML = raw4_value;
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*selectedTopics*/ 32 && hr_class_value !== (hr_class_value = "" + (/*topic*/ ctx[27].id + " dividerThin" + " svelte-orjvly"))) {
    				attr_dev(hr, "class", hr_class_value);
    			}

    			if ((!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41) && raw0_value !== (raw0_value = /*row*/ ctx[30].measuretitle + "")) div0.innerHTML = raw0_value;
    			if (!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41 && div0_class_value !== (div0_class_value = "measure " + /*row*/ ctx[30].topic + " svelte-orjvly")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			}

    			if (/*row*/ ctx[30].since) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div7, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if ((!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41) && raw1_value !== (raw1_value = /*row*/ ctx[30].title + "")) div4.innerHTML = raw1_value;			if ((!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41) && raw2_value !== (raw2_value = /*row*/ ctx[30].commstext + "")) div5.innerHTML = raw2_value;			if ((!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41) && raw3_value !== (raw3_value = /*row*/ ctx[30].sourcetext + "")) a0.innerHTML = raw3_value;
    			if (!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41 && a0_href_value !== (a0_href_value = /*row*/ ctx[30].sourceURL)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (/*row*/ ctx[30].type == "line") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div8, t8);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*row*/ ctx[30].type == "dualLine") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div8, t9);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*row*/ ctx[30].type == "number") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_1(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div8, t10);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*row*/ ctx[30].type == "bar") {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty[0] & /*dataText, selectedTopics, selected*/ 41) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block$1(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div8, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41) && raw4_value !== (raw4_value = /*row*/ ctx[30].sourcetext + "")) a1.innerHTML = raw4_value;
    			if (!current || dirty[0] & /*dataText, selectedTopics, selected*/ 41 && a1_href_value !== (a1_href_value = /*row*/ ctx[30].sourceURL)) {
    				attr_dev(a1, "href", a1_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div12);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(242:1) {#each dataText.filter((d) => d.topic === topic.id && (selected.id === d.outlook || selected.id === d.outlook2 || selected.id === \\\"allMeasures\\\")) as row}",
    		ctx
    	});

    	return block;
    }

    // (224:0) {#each selectedTopics as topic}
    function create_each_block_1(ctx) {
    	let div2;
    	let hr;
    	let hr_class_value;
    	let t0;
    	let div1;
    	let img;
    	let img_src_value;
    	let t1;
    	let div0;
    	let t2;
    	let raw0_value = /*topic*/ ctx[27].title + "";
    	let t3;
    	let p;
    	let raw1_value = /*topic*/ ctx[27].description + "";
    	let t4;
    	let t5;
    	let div3;
    	let a;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[20](/*topic*/ ctx[27], ...args);
    	}

    	let each_value_2 = /*dataText*/ ctx[0].filter(func);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			hr = element("hr");
    			t0 = space();
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			div0 = element("div");
    			t2 = element("t");
    			t3 = space();
    			p = element("p");
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div3 = element("div");
    			a = element("a");
    			a.textContent = "▲ Back to the top";
    			attr_dev(hr, "class", hr_class_value = "topline " + /*topic*/ ctx[27].id + " head divider" + " svelte-orjvly");
    			add_location(hr, file, 229, 2, 5996);
    			attr_dev(img, "alt", "");
    			if (!src_url_equal(img.src, img_src_value = "https://www.ons.gov.uk/visualisations/dvcwellbeing/icons/" + /*topic*/ ctx[27].id + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file, 231, 3, 6075);
    			attr_dev(t2, "class", "domainHeading");
    			add_location(t2, file, 236, 4, 6218);
    			attr_dev(p, "class", "domainExplainerText");
    			add_location(p, file, 237, 4, 6272);
    			attr_dev(div0, "class", "innerTextbox");
    			add_location(div0, file, 235, 3, 6186);
    			attr_dev(div1, "class", "topTextbox");
    			add_location(div1, file, 230, 2, 6046);
    			attr_dev(div2, "id", "wellbeing-head");
    			attr_dev(div2, "class", "topic wellbeingdomain alldomain wellbeing-head all-head Nochange");
    			attr_dev(div2, "tabindex", "-1");
    			add_location(div2, file, 224, 1, 5868);
    			attr_dev(a, "href", "#filteringOptions");
    			attr_dev(a, "class", "svelte-orjvly");
    			add_location(a, file, 349, 2, 9519);
    			attr_dev(div3, "class", "backToTop");
    			add_location(div3, file, 348, 1, 9492);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, hr);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, t2);
    			t2.innerHTML = raw0_value;
    			append_dev(div0, t3);
    			append_dev(div0, p);
    			p.innerHTML = raw1_value;
    			insert_dev(target, t4, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t5, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, a);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*selectedTopics*/ 32 && hr_class_value !== (hr_class_value = "topline " + /*topic*/ ctx[27].id + " head divider" + " svelte-orjvly")) {
    				attr_dev(hr, "class", hr_class_value);
    			}

    			if (!current || dirty[0] & /*selectedTopics*/ 32 && !src_url_equal(img.src, img_src_value = "https://www.ons.gov.uk/visualisations/dvcwellbeing/icons/" + /*topic*/ ctx[27].id + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty[0] & /*selectedTopics*/ 32) && raw0_value !== (raw0_value = /*topic*/ ctx[27].title + "")) t2.innerHTML = raw0_value;			if ((!current || dirty[0] & /*selectedTopics*/ 32) && raw1_value !== (raw1_value = /*topic*/ ctx[27].description + "")) p.innerHTML = raw1_value;
    			if (dirty[0] & /*dataText, selectedTopics, selected, dataCharts*/ 45) {
    				each_value_2 = /*dataText*/ ctx[0].filter(func);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t5.parentNode, t5);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(224:0) {#each selectedTopics as topic}",
    		ctx
    	});

    	return block;
    }

    // (353:0) {#each glossary as entry, i}
    function create_each_block(ctx) {
    	let p;
    	let t_value = /*glossary*/ ctx[1].label + "";
    	let t;
    	let p_id_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "visibility", "hidden");
    			set_style(p, "height", "0");
    			attr_dev(p, "id", p_id_value = /*entry*/ ctx[24].hash);
    			add_location(p, file, 353, 1, 9626);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*glossary*/ 2 && t_value !== (t_value = /*glossary*/ ctx[1].label + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*glossary*/ 2 && p_id_value !== (p_id_value = /*entry*/ ctx[24].hash)) {
    				attr_dev(p, "id", p_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(353:0) {#each glossary as entry, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div0;
    	let t13;
    	let t0;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let a4;
    	let t10;
    	let a5;
    	let t12;
    	let t14;
    	let div3;
    	let div1;
    	let t15;
    	let div2;
    	let label;
    	let input;
    	let input_checked_value;
    	let t16;
    	let span;
    	let t17;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let glossary_1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_4 = outlooks;
    	validate_each_argument(each_value_4);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_3[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*updatedTopics*/ ctx[8];
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_1 = /*selectedTopics*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*glossary*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	glossary_1 = new Glossary({
    			props: {
    				glossarySelected: /*glossarySelected*/ ctx[6],
    				glossary: /*glossary*/ ctx[1],
    				lastGlossaryClick: /*lastGlossaryClick*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t13 = element("t");
    			t0 = text("We assign each ");
    			a0 = element("a");
    			a0.textContent = "measure";
    			t2 = text("\r\n\t\ta\r\n\t\t");
    			a1 = element("a");
    			a1.textContent = "positive change";
    			t4 = text(",\r\n\t\t");
    			a2 = element("a");
    			a2.textContent = "negative change";
    			t6 = text(",\r\n\t\t");
    			a3 = element("a");
    			a3.textContent = "no change";
    			t8 = text(", or\r\n\t\t");
    			a4 = element("a");
    			a4.textContent = "change not assessed";
    			t10 = text("\r\n\t\tlabel based on assessment of change. See our\r\n\t\t");
    			a5 = element("a");
    			a5.textContent = "definitions tool";
    			t12 = text(" for definitions of these labels and other terms that may be unfamiliar.");
    			t14 = space();
    			div3 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t15 = space();
    			div2 = element("div");
    			label = element("label");
    			input = element("input");
    			t16 = space();
    			span = element("span");
    			t17 = space();
    			t19 = element("t");
    			t19.textContent = "Select all";
    			t20 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t21 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t22 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t23 = space();
    			create_component(glossary_1.$$.fragment);
    			attr_dev(a0, "class", "i svelte-orjvly");
    			attr_dev(a0, "href", "#measure");
    			add_location(a0, file, 140, 17, 3922);
    			attr_dev(a1, "class", "i svelte-orjvly");
    			attr_dev(a1, "href", "#improvelabel");
    			add_location(a1, file, 146, 2, 4039);
    			attr_dev(a2, "class", "i svelte-orjvly");
    			attr_dev(a2, "href", "#declinelabel");
    			add_location(a2, file, 152, 2, 4170);
    			attr_dev(a3, "class", "i svelte-orjvly");
    			attr_dev(a3, "href", "#nochange");
    			add_location(a3, file, 158, 2, 4301);
    			attr_dev(a4, "class", "i svelte-orjvly");
    			attr_dev(a4, "href", "#notassessed");
    			add_location(a4, file, 163, 2, 4420);
    			attr_dev(a5, "class", "i svelte-orjvly");
    			attr_dev(a5, "href", "#container");
    			add_location(a5, file, 170, 2, 4601);
    			add_location(t13, file, 139, 1, 3900);
    			attr_dev(div0, "id", "preText");
    			add_location(div0, file, 138, 0, 3879);
    			attr_dev(div1, "id", "selectionChange");
    			add_location(div1, file, 180, 1, 4846);
    			attr_dev(input, "type", "checkbox");
    			input.checked = input_checked_value = /*selectedTopics*/ ctx[5].length === /*updatedTopics*/ ctx[8].length;
    			attr_dev(input, "tabindex", "0");
    			add_location(input, file, 198, 3, 5257);
    			attr_dev(span, "class", "checkmarkBox");
    			add_location(span, file, 204, 3, 5403);
    			attr_dev(t19, "class", "checkBoxText");
    			add_location(t19, file, 205, 3, 5442);
    			attr_dev(label, "class", "filterContainer");
    			add_location(label, file, 197, 2, 5221);
    			attr_dev(div2, "id", "selectionTopic");
    			add_location(div2, file, 196, 1, 5192);
    			attr_dev(div3, "id", "filteringOptions");
    			add_location(div3, file, 179, 0, 4816);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t13);
    			append_dev(t13, t0);
    			append_dev(t13, a0);
    			append_dev(t13, t2);
    			append_dev(t13, a1);
    			append_dev(t13, t4);
    			append_dev(t13, a2);
    			append_dev(t13, t6);
    			append_dev(t13, a3);
    			append_dev(t13, t8);
    			append_dev(t13, a4);
    			append_dev(t13, t10);
    			append_dev(t13, a5);
    			append_dev(t13, t12);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(div1, null);
    				}
    			}

    			append_dev(div3, t15);
    			append_dev(div3, div2);
    			append_dev(div2, label);
    			append_dev(label, input);
    			append_dev(label, t16);
    			append_dev(label, span);
    			append_dev(label, t17);
    			append_dev(label, t19);
    			append_dev(div2, t20);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(div2, null);
    				}
    			}

    			insert_dev(target, t21, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t22, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t23, anchor);
    			mount_component(glossary_1, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[11], false, false, false, false),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[12], false, false, false, false),
    					listen_dev(a2, "click", /*click_handler_2*/ ctx[13], false, false, false, false),
    					listen_dev(a3, "click", /*click_handler_3*/ ctx[14], false, false, false, false),
    					listen_dev(a4, "click", /*click_handler_4*/ ctx[15], false, false, false, false),
    					listen_dev(a5, "click", /*click_handler_5*/ ctx[16], false, false, false, false),
    					listen_dev(input, "change", /*toggleAll*/ ctx[9], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selected*/ 8) {
    				each_value_4 = outlooks;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_4(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_4.length;
    			}

    			if (!current || dirty[0] & /*selectedTopics*/ 32 && input_checked_value !== (input_checked_value = /*selectedTopics*/ ctx[5].length === /*updatedTopics*/ ctx[8].length)) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty[0] & /*updatedTopics, selectedTopics*/ 288) {
    				each_value_3 = /*updatedTopics*/ ctx[8];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty[0] & /*dataText, selectedTopics, selected, dataCharts*/ 45) {
    				each_value_1 = /*selectedTopics*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t22.parentNode, t22);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*glossary*/ 2) {
    				each_value = /*glossary*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t23.parentNode, t23);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const glossary_1_changes = {};
    			if (dirty[0] & /*glossarySelected*/ 64) glossary_1_changes.glossarySelected = /*glossarySelected*/ ctx[6];
    			if (dirty[0] & /*glossary*/ 2) glossary_1_changes.glossary = /*glossary*/ ctx[1];
    			if (dirty[0] & /*lastGlossaryClick*/ 16) glossary_1_changes.lastGlossaryClick = /*lastGlossaryClick*/ ctx[4];
    			glossary_1.$set(glossary_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			transition_in(glossary_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			transition_out(glossary_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t21);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t22);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t23);
    			destroy_component(glossary_1, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function spliceSlice(str, index, count, add) {
    	if (index < 0) {
    		index = str.length + index;

    		if (index < 0) {
    			index = 0;
    		}
    	}

    	return str.slice(0, index) + (add || "") + str.slice(index + count);
    }

    function formatDate(dateStr) {
    	if (!dateStr) return dateStr;
    	const str = String(dateStr);

    	const monthMap = {
    		jan: "Jan",
    		feb: "Feb",
    		mar: "Mar",
    		apr: "Apr",
    		may: "May",
    		jun: "June",
    		jul: "July",
    		aug: "Aug",
    		sep: "Sept",
    		oct: "Oct",
    		nov: "Nov",
    		dec: "Dec"
    	};

    	const longMatch = str.match(/^(\d{1,2})-([A-Za-z]+)-(\d{2})$/);

    	if (longMatch) {
    		const month = monthMap[longMatch[2].toLowerCase()];
    		const year = 2000 + parseInt(longMatch[3]);
    		if (!month) return str;
    		return `${parseInt(longMatch[1])} ${month} ${year}`;
    	}

    	const shortMatch = str.match(/^([A-Za-z]+)-(\d{2})$/);

    	if (shortMatch) {
    		const month = monthMap[shortMatch[1].toLowerCase()];

    		const year = parseInt(shortMatch[2]) >= 30
    		? 1900 + parseInt(shortMatch[2])
    		: 2000 + parseInt(shortMatch[2]);

    		if (!month) return str;
    		return `${month} ${year}`;
    	}

    	return str;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let glossarySelected;
    	let selectedTopics;
    	let $url;
    	validate_store(url, 'url');
    	component_subscribe($$self, url, $$value => $$invalidate(10, $url = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);
    	let { glossary } = $$props;
    	let chartWidth;
    	let checkedTopics = topics.map(() => true);
    	let selected = outlooks[0];
    	let lastGlossaryClick = "";
    	let { dataCharts, dataText } = $$props;

    	//this makes sure that the tiles are in the right order
    	dataText.sort((a, b) => order.indexOf(a.measure) - order.indexOf(b.measure));

    	function updateLastGlossaryClick(i) {
    		$$invalidate(4, lastGlossaryClick = i);
    		console.log(lastGlossaryClick);
    	}

    	onMount(() => window.updateLastGlossaryClick = updateLastGlossaryClick);
    	let count = 0;

    	// Process dataText
    	dataText.forEach((e, i) => Object.keys(e).forEach(el => {
    		if (typeof dataText[i][el] == "string") {
    			count++;

    			$$invalidate(
    				0,
    				dataText[i][el] = dataText[i][el].replace(/(?<=\[).+?(?=\])/g, str => {
    					let href = str.match(/(?<=\().+?(?=\))/);
    					let readable = str.replace(href, "").replace("(", "").replace(")", "");
    					let html = `<a class="i" id="${"gloslink" + count}" onclick="updateLastGlossaryClick('${"gloslink" + count}')" href="#${href}">${readable}</a>`;
    					return html;
    				}).replace(/\[/g, "").replace(/\]/g, ""),
    				dataText
    			);
    		}
    	}));

    	// Create updatedTopics with the processed values for `topics`
    	let updatedTopics = topics.map((topic, i) => {
    		let updatedTopic = { ...topic };

    		Object.keys(updatedTopic).forEach(el => {
    			if (typeof updatedTopic[el] == "string") {
    				count++;

    				updatedTopic[el] = updatedTopic[el].replace(/(?<=\[).+?(?=\])/g, str => {
    					let href = str.match(/(?<=\().+?(?=\))/);
    					let readable = str.replace(href, "").replace("(", "").replace(")", "");
    					let html = `<a class="i" id="${"gloslink" + count}" onclick="updateLastGlossaryClick('${"gloslink" + count}')" href="#${href}">${readable}</a>`;
    					return html;
    				}).replace(/\[/g, "").replace(/\]/g, "");
    			}
    		});

    		return updatedTopic;
    	});

    	function toggleAll(e) {
    		$$invalidate(5, selectedTopics = e.target.checked ? [...updatedTopics] : []);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (glossary === undefined && !('glossary' in $$props || $$self.$$.bound[$$self.$$.props['glossary']])) {
    			console_1.warn("<Dashboard> was created without expected prop 'glossary'");
    		}

    		if (dataCharts === undefined && !('dataCharts' in $$props || $$self.$$.bound[$$self.$$.props['dataCharts']])) {
    			console_1.warn("<Dashboard> was created without expected prop 'dataCharts'");
    		}

    		if (dataText === undefined && !('dataText' in $$props || $$self.$$.bound[$$self.$$.props['dataText']])) {
    			console_1.warn("<Dashboard> was created without expected prop 'dataText'");
    		}
    	});

    	const writable_props = ['glossary', 'dataCharts', 'dataText'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], []];
    	const click_handler = () => updateLastGlossaryClick("preText");
    	const click_handler_1 = () => updateLastGlossaryClick("preText");
    	const click_handler_2 = () => updateLastGlossaryClick("preText");
    	const click_handler_3 = () => updateLastGlossaryClick("preText");
    	const click_handler_4 = () => updateLastGlossaryClick("preText");
    	const click_handler_5 = () => updateLastGlossaryClick("preText");

    	function input_change_handler() {
    		selected = this.__value;
    		$$invalidate(3, selected);
    	}

    	function input_change_handler_1() {
    		selectedTopics = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		(($$invalidate(5, selectedTopics), $$invalidate(8, updatedTopics)), $$invalidate(23, checkedTopics));
    	}

    	const func = (topic, d) => d.topic === topic.id && (selected.id === d.outlook || selected.id === d.outlook2 || selected.id === "allMeasures");

    	$$self.$$set = $$props => {
    		if ('glossary' in $$props) $$invalidate(1, glossary = $$props.glossary);
    		if ('dataCharts' in $$props) $$invalidate(2, dataCharts = $$props.dataCharts);
    		if ('dataText' in $$props) $$invalidate(0, dataText = $$props.dataText);
    	};

    	$$self.$capture_state = () => ({
    		csvParse,
    		autoType,
    		LineChart,
    		DualLineChart,
    		ColumnChart,
    		StaticNumber,
    		Glossary,
    		topics,
    		outlooks,
    		onMount,
    		url,
    		order,
    		glossary,
    		chartWidth,
    		checkedTopics,
    		selected,
    		lastGlossaryClick,
    		dataCharts,
    		dataText,
    		spliceSlice,
    		updateLastGlossaryClick,
    		count,
    		updatedTopics,
    		toggleAll,
    		formatDate,
    		selectedTopics,
    		glossarySelected,
    		$url
    	});

    	$$self.$inject_state = $$props => {
    		if ('glossary' in $$props) $$invalidate(1, glossary = $$props.glossary);
    		if ('chartWidth' in $$props) chartWidth = $$props.chartWidth;
    		if ('checkedTopics' in $$props) $$invalidate(23, checkedTopics = $$props.checkedTopics);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('lastGlossaryClick' in $$props) $$invalidate(4, lastGlossaryClick = $$props.lastGlossaryClick);
    		if ('dataCharts' in $$props) $$invalidate(2, dataCharts = $$props.dataCharts);
    		if ('dataText' in $$props) $$invalidate(0, dataText = $$props.dataText);
    		if ('count' in $$props) count = $$props.count;
    		if ('updatedTopics' in $$props) $$invalidate(8, updatedTopics = $$props.updatedTopics);
    		if ('selectedTopics' in $$props) $$invalidate(5, selectedTopics = $$props.selectedTopics);
    		if ('glossarySelected' in $$props) $$invalidate(6, glossarySelected = $$props.glossarySelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$url*/ 1024) {
    			$$invalidate(6, glossarySelected = $url.hash.replace("#", ""));
    		}
    	};

    	$$invalidate(5, selectedTopics = updatedTopics.filter((t, i) => checkedTopics[i]));

    	return [
    		dataText,
    		glossary,
    		dataCharts,
    		selected,
    		lastGlossaryClick,
    		selectedTopics,
    		glossarySelected,
    		updateLastGlossaryClick,
    		updatedTopics,
    		toggleAll,
    		$url,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		input_change_handler,
    		$$binding_groups,
    		input_change_handler_1,
    		func
    	];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { glossary: 1, dataCharts: 2, dataText: 0 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get glossary() {
    		throw new Error("<Dashboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set glossary(value) {
    		throw new Error("<Dashboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataCharts() {
    		throw new Error("<Dashboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataCharts(value) {
    		throw new Error("<Dashboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataText() {
    		throw new Error("<Dashboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataText(value) {
    		throw new Error("<Dashboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    // (29:0) {#if dataCharts && dataText && glossary}
    function create_if_block(ctx) {
    	let dashboard;
    	let current;

    	dashboard = new Dashboard({
    			props: {
    				dataCharts: /*dataCharts*/ ctx[0],
    				dataText: /*dataText*/ ctx[1],
    				glossary: /*glossary*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dashboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dashboard_changes = {};
    			if (dirty & /*dataCharts*/ 1) dashboard_changes.dataCharts = /*dataCharts*/ ctx[0];
    			if (dirty & /*dataText*/ 2) dashboard_changes.dataText = /*dataText*/ ctx[1];
    			if (dirty & /*glossary*/ 4) dashboard_changes.glossary = /*glossary*/ ctx[2];
    			dashboard.$set(dashboard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(29:0) {#if dataCharts && dataText && glossary}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*dataCharts*/ ctx[0] && /*dataText*/ ctx[1] && /*glossary*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*dataCharts*/ ctx[0] && /*dataText*/ ctx[1] && /*glossary*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*dataCharts, dataText, glossary*/ 7) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let dataCharts = null, dataText = null, glossary = null;

    	async function makeData() {
    		const res = await fetch(`./data/datacharts.csv`);
    		$$invalidate(0, dataCharts = csvParse(await res.text(), autoType));
    		const res2 = await fetch(`./data/datatext.csv`);
    		$$invalidate(1, dataText = csvParse(await res2.text(), autoType).map(d => ({ ...d, enddate: String(d.enddate) })));
    		const gloss = await fetch(`./data/glossary.csv`);
    		$$invalidate(2, glossary = csvParse(await gloss.text(), autoType));
    	} // console.table(dataText.map((d) => ({ enddate: d.enddate })));

    	onMount(makeData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Dashboard,
    		csvParse,
    		autoType,
    		onMount,
    		dataCharts,
    		dataText,
    		glossary,
    		makeData
    	});

    	$$self.$inject_state = $$props => {
    		if ('dataCharts' in $$props) $$invalidate(0, dataCharts = $$props.dataCharts);
    		if ('dataText' in $$props) $$invalidate(1, dataText = $$props.dataText);
    		if ('glossary' in $$props) $$invalidate(2, glossary = $$props.glossary);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dataCharts, dataText, glossary];
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
