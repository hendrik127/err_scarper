


export const apiUrl = process.env.NODE_ENV === 'production' ? 
'http://ec2-3-9-115-223.eu-west-2.compute.amazonaws.com:3000' : 
"http://localhost"

console.log(apiUrl);
