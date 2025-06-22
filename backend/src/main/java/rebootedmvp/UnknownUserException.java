package rebootedmvp;

/**
 * Indicates that a user cannot be found
 */
public class UnknownUserException extends RuntimeException{
    /**
     * Create a new UnknownUserException indicating that the variable `name`
     * had no assigned value.
     */
    public UnknownUserException(String name) {
        super("Cannot find user: '" + name);
    }
}