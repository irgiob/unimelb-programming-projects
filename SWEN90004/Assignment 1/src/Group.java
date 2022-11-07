/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * Note: this was provided scaffold code, no changes were made to this file
 * 
 * A group of tourists, each with its unique id, who are 
 * visiting the museum.
 * 
 * @author ngeard@unimelb.edu.au
 *
 */

public class Group {
  
	// a unique identifier for this tour group
	protected int id;
	
	//the next ID to be allocated
	protected static int nextId = 1;

	//create a new group with a given Id
	protected Group(int id) {
		this.id = id;
	}

	//get a new Group instance with a unique Id
	public static Group getNewGroup() {
		return new Group(nextId++);
	}

	//produce the Id of this group
	public int getId() {
		return id;
	}

	//produce an identifying string for the group
	public String toString() {
		return "group [" + id + "]";
	}
}
