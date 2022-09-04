import { Prisma, Profile } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { ProfileMediaSchema } from "./profiles.schema"

import { getProfiles, getProfile, createProfile, updateProfileMedia, followProfile, unfollowProfile } from "./profiles.service"

export async function getProfilesHandler() {
  const profiles = await getProfiles()
  return profiles
}

export async function getProfileHandler(
  request: FastifyRequest<{
    Params: { name: string }
  }>,
  reply: FastifyReply
) {
  
  const { name } = request.params
  const profile = await getProfile(name)

  if (!profile) {
    const error = new Error("No profile with this name")
    return reply.code(404).send(error)
  }

  reply.code(200).send(profile)
}

export async function createProfileHandler(
  request: FastifyRequest<{
    Body: Prisma.ProfileCreateInput
  }>,
  reply: FastifyReply
) {
  const profile = await createProfile(request.body)
  reply.code(200).send(profile);
}

export async function updateProfileMediaHandler(
  request: FastifyRequest<{
    Params: { name: string },
    Body: ProfileMediaSchema
  }>,
  reply: FastifyReply
) {
  const { name } = request.params
  const profile = await updateProfileMedia(name, request.body)
  reply.code(200).send(profile);
}

export async function followProfileHandler(
  request: FastifyRequest<{
    Params: { name: string },
  }>,
  reply: FastifyReply
) { 
  const { name: follower } = request.user as Profile
  const { name: target } = request.params

  if (target === follower) {
    return reply.code(400).send("You can't follow yourself")
  }

  const profile = await followProfile(target, follower)    
  reply.code(200).send(profile);  
}

export async function unfollowProfileHandler(
  request: FastifyRequest<{
    Params: { name: string }
  }>,
  reply: FastifyReply
) {
  const { name: follower } = request.user as Profile
  const { name: target } = request.params

  if (target === follower) {
    return reply.code(400).send("You can't unfollow yourself")
  }

  const profile = await unfollowProfile(target, follower)
  reply.code(200).send(profile);
}