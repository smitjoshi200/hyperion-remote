import { Discovery } from './magic-home';
import { Control } from './magic-home';

let discovery = new Discovery();
discovery.scan(1000).then(devices => {
    console.log(devices);
});