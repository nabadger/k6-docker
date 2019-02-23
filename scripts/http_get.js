import http from 'k6/http';
import { sleep, check } from "k6";
import { Rate } from "k6/metrics";

// Define default options 
export let options = {
  noConnectionReuse: true,
  discardResponseBodies: true,
  userAgent: "K6Testing",
  rps: 2,
  stages: [
    { duration: "10s", target: 3 },
  ],
  thresholds: {
    "errors": ["rate<0.1"], // <10% errors
  }
};
  
// Store our errors
let errorRate = new Rate("errors");

// A file containing a json-list of paths (excluding domain)
const urls = JSON.parse(open("/scripts/url-paths.json"));

export default function() {
  // Pick a url from the json list
  var url = urls[__ITER % urls.length];
  console.log(url)
  if (!url)
    return

  // Get the result (take the hostname from env and combine with url)
  var res = http.get(`https://${__ENV.HOSTNAME}/${url}`); 
	
  // Ensure all urls result in a 200 and return in required time
  var passed = check(res, {
        "is status 200": (r) => r.status === 200,
        "transaction time OK(All under 1s)": (r) => r.timings.duration < 1000
    });
    if (!passed) {
        errorRate.add(1);
    }

    sleep(1)
    
};
