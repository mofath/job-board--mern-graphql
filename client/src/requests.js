import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { getAccessToken, isLoggedIn } from "./auth";
import gql from "graphql-tag";

const endPointURL = "http://localhost:9000/graphql";

const client = new ApolloClient({
  link: new HttpLink({ uri: endPointURL }),
  cache: new InMemoryCache(),
});

// async function graphqlRequest(query, variables = {}) {
//   const request = {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify({ query, variables }),
//   };
//   if (isLoggedIn())
//     request.headers["authorization"] = "Bearer " + getAccessToken();
//   const response = await fetch(endPointURL, request);
//   const responseBody = await response.json();
//   if (responseBody.errors) {
//     const errMesssage = responseBody.errors
//       .map((err) => err.message)
//       .join("\n");
//     throw new Error(errMesssage);
//   }
//   return responseBody.data;
// }

export async function loadJobs() {
  const query = gql`
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { data: { jobs } } = await client.query({query});
  return jobs;
}

export async function loadJob(id) {
  const query = gql`query JobQuery($id: ID!){
    job(id: $id){
        id
        title
        company{
            id
            name
        }
        description
    }
  }`;
  const { data: { job } } = await client.query({query, variables: { id }});
  return job;
}

export async function loadCompany(id) {
  const query = gql`query CompanyQuery($id: ID!){
    company(id: $id){
      id 
      name
      description
      jobs {
        id
        title
      }
    }
  }`;
  const { data: { company } } = await client.query({ query, variables: { id } });
  return company;
}

export async function createJob(input) {
  const mutation = gql`mutation CreateJob($input: CreateJobInput){
    job: createJob(input: $input){
      id 
      title
      company {
        id
        name
      }
    }
  }`;
  const {data: {job}} = await client({mutation, variables: { input }});
  return job;
}
