'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { FamilyMember, Family, Plan } from '@/types/family'

export async function getFamilies(): Promise<Family[]> {
  const supabase = createServerActionClient({ cookies })
  
  const { data, error } = await supabase
    .from('families')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch families: ${error.message}`)
  return data as Family[]
}

export async function createFamily(name: string, description: string, planId: number): Promise<Family> {
  const supabase = createServerActionClient({ cookies })
  
  const { data: family, error: familyError } = await supabase
    .from('families')
    .insert({ name, description, plan_id: planId })
    .select()
    .single()

  if (familyError) throw new Error(`Failed to create family: ${familyError.message}`)

  const { error: userError } = await supabase
    .from('family_users')
    .insert({ family_id: family.id, role: 'owner' })

  if (userError) throw new Error(`Failed to add user to family: ${userError.message}`)

  return family as Family
}

export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const supabase = createServerActionClient({ cookies })
  
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', familyId)

  if (error) throw new Error(`Failed to fetch family members: ${error.message}`)
  return data as FamilyMember[]
}

export async function getPlans(): Promise<Plan[]> {
  const supabase = createServerActionClient({ cookies })
  
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true })

  if (error) throw new Error(`Failed to fetch plans: ${error.message}`)
  return data as Plan[]
}

export async function addFamilyMember(member: Partial<FamilyMember>): Promise<FamilyMember> {
  const supabase = createServerActionClient({ cookies })
  
  const { data, error } = await supabase
    .from('family_members')
    .insert(member)
    .select()
    .single()

  if (error) throw new Error(`Failed to add family member: ${error.message}`)
  return data as FamilyMember
}

export async function updateFamilyMember(member: Partial<FamilyMember>): Promise<FamilyMember> {
  const supabase = createServerActionClient({ cookies })
  
  const { data, error } = await supabase
    .from('family_members')
    .update(member)
    .eq('id', member.id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update family member: ${error.message}`)
  return data as FamilyMember
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const supabase = createServerActionClient({ cookies })
  
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete family member: ${error.message}`)
}

