// Neo4j Schema Setup for Evidence Knowledge Graph

CREATE CONSTRAINT paper_id_unique IF NOT EXISTS FOR (p:Paper) REQUIRE p.paper_id IS UNIQUE;
CREATE CONSTRAINT claim_id_unique IF NOT EXISTS FOR (c:Claim) REQUIRE c.claim_id IS UNIQUE;

// Relationship Schema:
// (p:Paper)-[:AUTHORED_BY]->(a:Author)
// (p:Paper)-[:CONTAINS_CLAIM]->(c:Claim)
// (c:Claim)-[:SUPPORTED_BY]->(e:Evidence)
// (c1:Claim)-[:CONTRADICTS]->(c2:Claim)
// (c:Claim)-[:USES_DATASET]->(d:Dataset)
// (c:Claim)-[:USES_METHOD]->(m:Method)
