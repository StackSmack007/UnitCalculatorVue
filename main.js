require(["https://cdn.jsdelivr.net/npm/vue/dist/vue.js", "https://cdn.jsdelivr.net/npm/vue2-timepicker@1.1.2/dist/VueTimepicker.umd.min.js"], function (Vue, timePicker) {
    const defaultBoxes = 100;
    const koef = 500000;
    const VueTimepicker = timePicker.default;
    const unitsRangePossible = { max: 50000000, min: 34747 };

    const timeFromOveralMinutes = mins => {
        const hours = Math.floor(mins / 60);
        const minutes = mins - hours * 60;
        return `${pad(hours, 2)}:${pad(minutes, 2)}`
    };

    const minutesFromTime = timeStr => {
        const [hours, mins] = timeStr.split(":").map(x => +x);
        return hours * 60 + mins
    };

    const pad = (n, width, z) => {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    }

    let clockF = null;

    new Vue({
        name: 'demo',
        el: '#game',
        components: { VueTimepicker },

        data() {
            return {
                mode: 'time',
                time: '00:00',
                boxes: defaultBoxes,
                unitCount: '',
                countDown: {
                    isRunning: false,
                    minutesElapsed: 0
                }
            }
        },

        methods: {
            updateTime() {
                //  debugger;
                const tot_min = Math.ceil(this.boxes * koef / (this.unitCount));
                this.time = timeFromOveralMinutes(tot_min);
                this.stopClock();
            },

            stopClock() {
                clearInterval(clockF);
                clockF = null;
            },

            updateUnitCount() {
                this.unitCount = Math.ceil(this.boxes * koef / (this.overalTimeInMinutes));
                this.stopClock();
            },

            turnClock() {
                const enteringState = this.countDown.isRunning;
                this.resetClock();
                this.countDown.minutesElapsed = minutesFromTime(this.time);
                this.stopClock();
                if (!enteringState)
                    this.startClock()
            },

            resetClock() {
                this.countDown.isRunning = false;
                this.countDown.minutesElapsed = 0;
            },

            startClock() {
                this.countDown.isRunning = true;
                clockF = setInterval(() => {
                    if (this.countDown.minutesElapsed > 0)
                        this.countDown.minutesElapsed--;
                    else {
                        let audio = new Audio('./resourses/alarm.mp3');
                        audio.play();
                        this.stopClock();
                    }
                }, 1000 * 60)
            }
        },

        computed: {
            unitPlaceHolder() { return !this.isTimeAsked ? 'Units ?...' : this.unitCount > 0 ? this.unitCount : '-' },

            timePlaceHolder() {
                // debugger;
                // // if (typeof (this.time) === 'String') return '00:00';
                if (!this.isTimeAsked) {
                    const hours = Number(this.time.split(':')[0]);
                    if (hours > 23) return `over ${hours} hours`;
                    return this.time;
                }
                return 'Time ?...'
            },

            isTimeAsked() { return this.mode === 'units' },

            overalTimeInMinutes() {
                [hours, mins] = this.time.split(":").map(x => Number(x));
                return hours * 60 + mins;
            },

            hasData() { return this.time != '00:00' && this.unitCount != '' },

            minutesElapsed() { return timeFromOveralMinutes(this.countDown.minutesElapsed) },

            boxesObtained() {
                let completionPerc = (minutesFromTime(this.time) - this.countDown.minutesElapsed) / minutesFromTime(this.time);
                return Math.floor(this.boxes * completionPerc)
            }
        },

        watch: {
            boxes(newV, oldV) {
                if (newV > 100) { this.boxes = 100; return; }
                if (newV < 1) { this.boxes = 1; return; }
                if (!this.hasData || (oldV < 1 || oldV > 100)) return;
                if (this.isTimeAsked) this.unitCount = Math.ceil(this.unitCount * +newV / +oldV);
                else this.updateTime();
                this.resetClock();
            },

            unitCount(newV, oldV) {
                if (newV > unitsRangePossible.max) { this.unitCount = unitsRangePossible.max }
                if (newV < unitsRangePossible.min) { this.unitCount = unitsRangePossible.min }
            }
        }
    })
})