import { ImageResponse, NextRequest, NextResponse } from "next/server";

if (process.env.VC_REST_API_TOKEN === undefined) {
  throw Error("Vercel token needed for app to function");
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const dplId = params.id;

  if (typeof dplId !== "string") {
    return NextResponse.json({ error: "invalid deployment id" });
  }

  try {
    const apiReq = await fetch(
      `https://api.vercel.com/v13/deployments/dpl_${dplId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.VC_REST_API_TOKEN}`,
        },

        next: {
          revalidate: 0,
        },
      }
    );

    const apiRes = (await apiReq.json()) as VercelApiResponse;
    const state = apiRes.readyState;

    //@ts-ignore
    if (apiRes.error) {
      return NextResponse.json({ error: "Not found" });
    }
    return new ImageResponse(ImageBuilder({ type: state }), {
      width: 200,
      height: 50,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      error: "An error has occurred, check server logs",
    });
  }
}

const ImageBuilder = ({ type }: { type: VercelApiResponse["readyState"] }) => {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px 20px",
        height: "50px",
        alignItems: "center",
        gap: "20px",
        fontSize: "24px",
        fontWeight: "900",
        background: "#efefef",
        borderRadius: "10px",
        border: "2px solid #ddd",
        width: "100%",
      }}
    >
      <b
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "100%",
          backgroundColor:
            type === "QUEUED"
              ? "lightgrey"
              : type === "BUILDING"
              ? "orange"
              : type === "ERROR"
              ? "red"
              : type === "INITIALIZING"
              ? "lightblue"
              : type === "CANCELED"
              ? "black"
              : type === "READY"
              ? "limegreen"
              : "white",
        }}
      />
      {type}
    </div>
  );
};

type VercelApiResponse =
  | {
      build: {
        /** The keys of the environment variables that were assigned during the build phase. */
        env: string[];
      };
      builds?: { [key: string]: unknown }[];
      /** The flag saying if Vercel Connect configuration is used for builds */
      connectBuildsEnabled?: boolean;
      /** The ID of Vercel Connect configuration used for this deployment */
      connectConfigurationId?: string;
      /** The region where the deployment was first created */
      createdIn: string;
      /** The keys of the environment variables that were assigned during runtime */
      env: string[];
      /** An object used to configure your Serverless Functions */
      functions?: {
        [key: string]: {
          memory?: number;
          maxDuration?: number;
          runtime?: string;
          includeFiles?: string;
          excludeFiles?: string;
        };
      } | null;
      /** Vercel URL to inspect the deployment. */
      inspectorUrl: string | null;
      /** Is the deployment currently queued waiting for a Concurrent Build Slot to be available */
      isInConcurrentBuildsQueue: boolean;
      /** An object containing the deployment's metadata */
      meta: { [key: string]: string };
      /** An monorepo manager that was used for the deployment */
      monorepoManager?: string | null;
      /** The name of the project associated with the deployment at the time that the deployment was created */
      name: string;
      /** The unique ID of the user or team the deployment belongs to */
      ownerId: string;
      /** The pricing plan the deployment was made under */
      plan: "pro" | "enterprise" | "hobby" | "oss";
      /** The ID of the project the deployment is associated with */
      projectId: string;
      /** A list of routes objects used to rewrite paths to point towards other internal or external paths */
      routes:
        | (
            | {
                src: string;
                dest?: string;
                headers?: { [key: string]: string };
                methods?: string[];
                continue?: boolean;
                override?: boolean;
                caseSensitive?: boolean;
                check?: boolean;
                important?: boolean;
                status?: number;
                has?: (
                  | {
                      type: "host";
                      value: string;
                    }
                  | {
                      type: "header" | "cookie" | "query";
                      key: string;
                      value?: string;
                    }
                )[];

                missing?: (
                  | {
                      type: "host";

                      value: string;
                    }
                  | {
                      type: "header" | "cookie" | "query";

                      key: string;

                      value?: string;
                    }
                )[];

                locale?: {
                  redirect?: { [key: string]: string };

                  cookie?: string;
                };

                /** A middleware key within the `output` key under the build result. Overrides a `middleware` definition. */

                middlewarePath?: string;

                /** The original middleware matchers. */

                middlewareRawSrc?: string[];

                /** A middleware index in the `middleware` key under the build result */

                middleware?: number;
              }
            | {
                handle:
                  | "error"
                  | "filesystem"
                  | "hit"
                  | "miss"
                  | "rewrite"
                  | "resource";

                src?: string;

                dest?: string;

                status?: number;
              }
            | {
                src: string;

                continue: boolean;

                middleware: 0;
              }
          )[]
        | null;

      gitRepo?:
        | (
            | {
                namespace: string;

                projectId: number;

                type: "gitlab";

                url: string;

                path: string;

                defaultBranch: string;

                name: string;

                private: boolean;

                ownerType: "team" | "user";
              }
            | {
                org: string;

                repo: string;

                repoId: number;

                type: "github";

                repoOwnerId: string;

                path: string;

                defaultBranch: string;

                name: string;

                private: boolean;

                ownerType: "team" | "user";
              }
            | {
                owner: string;

                repoUuid: string;

                slug: string;

                type: "bitbucket";

                workspaceUuid: string;

                path: string;

                defaultBranch: string;

                name: string;

                private: boolean;

                ownerType: "team" | "user";
              }
          )
        | null;

      aliasAssignedAt?: (number | boolean) | null;

      lambdas?: {
        id: string;

        createdAt?: number;

        entrypoint?: string | null;

        readyState?: "BUILDING" | "ERROR" | "INITIALIZING" | "READY";

        readyStateAt?: number;

        output: {
          path: string;

          functionName: string;
        }[];
      }[];

      /** A boolean representing if the deployment is public or not. By default this is `false` */

      public: boolean;

      /** The state of the deployment depending on the process of deploying, or if it is ready or in an error state */

      readyState:
        | "QUEUED"
        | "BUILDING"
        | "ERROR"
        | "INITIALIZING"
        | "READY"
        | "CANCELED";

      /** The substate of the deployment when the state is "READY" */

      readySubstate?: "STAGED" | "PROMOTED";

      /** The regions the deployment exists in */

      regions: string[];

      /** Where was the deployment created from */

      source?:
        | "api-trigger-git-deploy"
        | "cli"
        | "clone/repo"
        | "git"
        | "import"
        | "import/repo";

      /** If defined, either `staging` if a staging alias in the format `<project>.<team>.now.sh` was assigned upon creation, or `production` if the aliases from `alias` were assigned */

      target?: ("staging" | "production") | null;

      /** The team that owns the deployment if any */

      team?: {
        /** The ID of the team owner */

        id: string;

        /** The name of the team owner */

        name: string;

        /** The slug of the team owner */

        slug: string;
      };

      type: "LAMBDAS";

      /** A string with the unique URL of the deployment */

      url: string;

      /** An array of domains that were provided by the user when creating the Deployment. */

      userAliases?: string[];

      /** The platform version that was used to create the deployment. */

      version: 2;

      /** Whether or not preview comments are enabled for the deployment */

      previewCommentsEnabled?: boolean;

      /** A list of all the aliases (default aliases, staging aliases and production aliases) that were assigned upon deployment creation */

      alias: string[];

      /** A boolean that will be true when the aliases from the alias property were assigned successfully */

      aliasAssigned: boolean;

      /** An object that will contain a `code` and a `message` when the aliasing fails, otherwise the value will be `null` */

      aliasError?: {
        code: string;

        message: string;
      } | null;

      aliasFinal?: string | null;

      aliasWarning?: {
        code: string;

        message: string;

        link?: string;

        action?: string;
      } | null;

      autoAssignCustomDomains?: boolean;

      automaticAliases?: string[];

      bootedAt: number;

      buildErrorAt?: number;

      buildingAt: number;

      canceledAt?: number;

      checksState?: "registered" | "running" | "completed";

      checksConclusion?: "succeeded" | "failed" | "skipped" | "canceled";

      /** A number containing the date when the deployment was created in milliseconds */

      createdAt: number;

      /** Information about the deployment creator */

      creator: {
        /** The ID of the user that created the deployment */

        uid: string;

        /** The username of the user that created the deployment */

        username?: string;
      };

      errorCode?: string;

      errorLink?: string;

      errorMessage?: string | null;

      errorStep?: string;

      gitSource?:
        | {
            type: "github";

            repoId: string | number;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "github";

            org: string;

            repo: string;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "gitlab";

            projectId: string | number;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "bitbucket";

            workspaceUuid?: string;

            repoUuid: string;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "bitbucket";

            owner: string;

            slug: string;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "custom";

            ref: string;

            sha: string;

            gitUrl: string;
          }
        | {
            type: "github";

            ref: string;

            sha: string;

            repoId: number;

            org?: string;

            repo?: string;
          }
        | {
            type: "gitlab";

            ref: string;

            sha: string;

            projectId: number;
          }
        | {
            type: "bitbucket";

            ref: string;

            sha: string;

            owner?: string;

            slug?: string;

            workspaceUuid: string;

            repoUuid: string;
          };

      /** A string holding the unique ID of the deployment */

      id: string;
    }
  | {
      lambdas?: {
        id: string;

        createdAt?: number;

        entrypoint?: string | null;

        readyState?: "BUILDING" | "ERROR" | "INITIALIZING" | "READY";

        readyStateAt?: number;

        output: {
          path: string;

          functionName: string;
        }[];
      }[];

      /** The name of the project associated with the deployment at the time that the deployment was created */

      name: string;

      /** An object containing the deployment's metadata */

      meta: { [key: string]: string };

      /** A boolean representing if the deployment is public or not. By default this is `false` */

      public: boolean;

      /** The state of the deployment depending on the process of deploying, or if it is ready or in an error state */

      readyState:
        | "QUEUED"
        | "BUILDING"
        | "ERROR"
        | "INITIALIZING"
        | "READY"
        | "CANCELED";

      /** The substate of the deployment when the state is "READY" */

      readySubstate?: "STAGED" | "PROMOTED";

      /** The regions the deployment exists in */

      regions: string[];

      /** Where was the deployment created from */

      source?:
        | "api-trigger-git-deploy"
        | "cli"
        | "clone/repo"
        | "git"
        | "import"
        | "import/repo";

      /** If defined, either `staging` if a staging alias in the format `<project>.<team>.now.sh` was assigned upon creation, or `production` if the aliases from `alias` were assigned */

      target?: ("staging" | "production") | null;

      /** The team that owns the deployment if any */

      team?: {
        /** The ID of the team owner */

        id: string;

        /** The name of the team owner */

        name: string;

        /** The slug of the team owner */

        slug: string;
      };

      type: "LAMBDAS";

      /** A string with the unique URL of the deployment */

      url: string;

      /** An array of domains that were provided by the user when creating the Deployment. */

      userAliases?: string[];

      /** The platform version that was used to create the deployment. */

      version: 2;

      /** Whether or not preview comments are enabled for the deployment */

      previewCommentsEnabled?: boolean;

      /** A list of all the aliases (default aliases, staging aliases and production aliases) that were assigned upon deployment creation */

      alias: string[];

      /** A boolean that will be true when the aliases from the alias property were assigned successfully */

      aliasAssigned: boolean;

      /** An object that will contain a `code` and a `message` when the aliasing fails, otherwise the value will be `null` */

      aliasError?: {
        code: string;

        message: string;
      } | null;

      aliasFinal?: string | null;

      aliasWarning?: {
        code: string;

        message: string;

        link?: string;

        action?: string;
      } | null;

      autoAssignCustomDomains?: boolean;

      automaticAliases?: string[];

      bootedAt: number;

      buildErrorAt?: number;

      buildingAt: number;

      canceledAt?: number;

      checksState?: "registered" | "running" | "completed";

      checksConclusion?: "succeeded" | "failed" | "skipped" | "canceled";

      /** A number containing the date when the deployment was created in milliseconds */

      createdAt: number;

      /** Information about the deployment creator */

      creator: {
        /** The ID of the user that created the deployment */

        uid: string;

        /** The username of the user that created the deployment */

        username?: string;
      };

      errorCode?: string;

      errorLink?: string;

      errorMessage?: string | null;

      errorStep?: string;

      gitSource?:
        | {
            type: "github";

            repoId: string | number;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "github";

            org: string;

            repo: string;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "gitlab";

            projectId: string | number;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "bitbucket";

            workspaceUuid?: string;

            repoUuid: string;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "bitbucket";

            owner: string;

            slug: string;

            ref?: string | null;

            sha?: string;

            prId?: number | null;
          }
        | {
            type: "custom";

            ref: string;

            sha: string;

            gitUrl: string;
          }
        | {
            type: "github";

            ref: string;

            sha: string;

            repoId: number;

            org?: string;

            repo?: string;
          }
        | {
            type: "gitlab";

            ref: string;

            sha: string;

            projectId: number;
          }
        | {
            type: "bitbucket";

            ref: string;

            sha: string;

            owner?: string;

            slug?: string;

            workspaceUuid: string;

            repoUuid: string;
          };

      /** A string holding the unique ID of the deployment */

      id: string;
    };
